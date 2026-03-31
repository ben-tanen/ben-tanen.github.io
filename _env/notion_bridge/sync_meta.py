"""Change detection via .sync-meta.json and git-based local edit checks."""

import json
import subprocess
from datetime import datetime, timezone
from pathlib import Path

from config import REPO_ROOT

SYNC_META_PATH = REPO_ROOT / ".sync-meta.json"


def load_sync_meta() -> dict:
    """Load .sync-meta.json, returning empty structure if missing."""
    if not SYNC_META_PATH.exists():
        return {"posts": {}, "projects": {}}
    with open(SYNC_META_PATH) as f:
        return json.load(f)


def save_sync_meta(meta: dict):
    """Write .sync-meta.json."""
    with open(SYNC_META_PATH, "w") as f:
        json.dump(meta, f, indent=2, sort_keys=True)
        f.write("\n")


def get_last_synced_at(meta: dict, collection: str, page_id: str) -> str | None:
    """Get the last_synced_at timestamp for a page, or None if never synced."""
    return meta.get(collection, {}).get(page_id, {}).get("last_synced_at")


def update_synced(meta: dict, collection: str, page_id: str, slug: str):
    """Mark a page as just synced (sets last_synced_at to now)."""
    if collection not in meta:
        meta[collection] = {}
    meta[collection][page_id] = {
        "slug": slug,
        "last_synced_at": datetime.now(timezone.utc).isoformat(),
    }


def get_oldest_sync_time(meta: dict) -> str | None:
    """Return the oldest last_synced_at across all collections, or None if empty."""
    oldest = None
    for collection in meta.values():
        if not isinstance(collection, dict):
            continue
        for entry in collection.values():
            ts = entry.get("last_synced_at")
            if ts and (oldest is None or ts < oldest):
                oldest = ts
    return oldest


def page_needs_sync(
    notion_last_edited: str,
    last_synced_at: str | None,
) -> bool:
    """Return True if the Notion page has been edited since last sync."""
    if last_synced_at is None:
        return True
    edited = datetime.fromisoformat(notion_last_edited)
    synced = datetime.fromisoformat(last_synced_at)
    return edited > synced


# ---------------------------------------------------------------------------
# Git-based local edit detection
# ---------------------------------------------------------------------------


def get_dirty_files() -> set[str]:
    """Get set of files with uncommitted changes (staged or unstaged).

    Returns paths relative to repo root.
    """
    result = subprocess.run(
        ["git", "diff", "--name-only", "HEAD"],
        capture_output=True,
        text=True,
        cwd=REPO_ROOT,
    )
    # Also check untracked files that match our patterns
    untracked = subprocess.run(
        ["git", "ls-files", "--others", "--exclude-standard"],
        capture_output=True,
        text=True,
        cwd=REPO_ROOT,
    )
    dirty = set()
    for line in result.stdout.strip().splitlines():
        if line:
            dirty.add(line)
    for line in untracked.stdout.strip().splitlines():
        if line:
            dirty.add(line)
    return dirty


def get_git_commit_time(file_path: Path) -> str | None:
    """Get the last commit time for a file (ISO format), or None if never committed."""
    rel_path = file_path.relative_to(REPO_ROOT)
    result = subprocess.run(
        ["git", "log", "-1", "--format=%cI", "--", str(rel_path)],
        capture_output=True,
        text=True,
        cwd=REPO_ROOT,
    )
    ts = result.stdout.strip()
    return ts if ts else None


def check_local_edit(
    file_path: Path,
    last_synced_at: str | None,
    dirty_files: set[str],
) -> str | None:
    """Check if a Jekyll file has been locally modified since last sync.

    Returns a reason string if the file should be blocked, or None if safe.
    """
    if last_synced_at is None:
        # Never synced — no local edit conflict possible
        return None

    rel_path = str(file_path.relative_to(REPO_ROOT))

    # Check 1: uncommitted changes
    if rel_path in dirty_files:
        return f"uncommitted local changes to {rel_path}"

    # Check 2: committed after last sync
    commit_time = get_git_commit_time(file_path)
    if commit_time:
        committed = datetime.fromisoformat(commit_time)
        synced = datetime.fromisoformat(last_synced_at)
        if committed > synced:
            return f"local commit to {rel_path} at {commit_time} (after last sync at {last_synced_at})"

    return None
