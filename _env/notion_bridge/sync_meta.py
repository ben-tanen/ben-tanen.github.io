"""Change detection via .sync-meta.json and git-based local edit checks."""

import hashlib
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


def get_last_synced_hash(meta: dict, collection: str, page_id: str) -> str | None:
    """Get the last_synced_hash for a page, or None if not recorded."""
    return meta.get(collection, {}).get(page_id, {}).get("last_synced_hash")


def get_synced_status(meta: dict, collection: str, page_id: str) -> str | None:
    """Get the last synced status for a page, or None if never synced."""
    return meta.get(collection, {}).get(page_id, {}).get("status")


def bytes_content_hash(data: bytes) -> str:
    """Return sha256 hex digest of an in-memory byte string."""
    return hashlib.sha256(data).hexdigest()


def file_content_hash(path: Path) -> str:
    """Return sha256 hex digest of the file's contents."""
    return bytes_content_hash(path.read_bytes())


def update_synced(
    meta: dict,
    collection: str,
    page_id: str,
    slug: str,
    status: str | None = None,
    file_path: Path | None = None,
):
    """Mark a page as just synced (sets last_synced_at to now).

    If file_path is provided, also records a content hash (last_synced_hash)
    so subsequent syncs can detect whether the file has been locally edited
    without depending on git timestamps.
    """
    if collection not in meta:
        meta[collection] = {}
    entry = {
        "slug": slug,
        "last_synced_at": datetime.now(timezone.utc).isoformat(),
    }
    if status:
        entry["status"] = status
    if file_path is not None and file_path.exists():
        entry["last_synced_hash"] = file_content_hash(file_path)
    meta[collection][page_id] = entry


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


def resolve_post_path(slug: str, config: dict) -> Path | None:
    """Find the local Jekyll file for a post by slug (checks _posts/ then _drafts/)."""
    posts_dir = REPO_ROOT / config["site"]["posts_dir"]
    drafts_dir = REPO_ROOT / config["site"]["drafts_dir"]
    matches = sorted(posts_dir.glob(f"*-{slug}.md"))
    if matches:
        return matches[-1]
    draft = drafts_dir / f"{slug}.md"
    if draft.exists():
        return draft
    return None


def resolve_project_path(slug: str, config: dict) -> Path | None:
    """Find the local Jekyll file for a project by slug."""
    path = REPO_ROOT / config["site"]["projects_dir"] / f"{slug}.md"
    return path if path.exists() else None


def get_locally_divergent_ids(meta: dict, collection: str, config: dict) -> set[str]:
    """Return the page IDs whose local file hash differs from the stored hash.

    Used to force-include pages in a sync run even when Notion's last_edited_time
    says they haven't changed — lets three-way check surface local-only edits.
    """
    resolver = resolve_post_path if collection == "posts" else resolve_project_path
    divergent = set()
    for page_id, entry in meta.get(collection, {}).items():
        stored_hash = entry.get("last_synced_hash")
        if not stored_hash:
            continue
        slug = entry.get("slug")
        if not slug:
            continue
        path = resolver(slug, config)
        if path is None or not path.exists():
            continue
        if file_content_hash(path) != stored_hash:
            divergent.add(page_id)
    return divergent


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
    last_synced_hash: str | None = None,
) -> str | None:
    """Check if a Jekyll file has been locally modified since last sync.

    Returns a reason string if the file should be blocked, or None if safe.

    When last_synced_hash is recorded, the check is purely content-based —
    if the current file hash matches the recorded hash, the file is unchanged
    regardless of git history. Falls back to the timestamp-based git check
    when no hash is recorded (migration path for pre-existing meta entries).
    """
    if last_synced_at is None:
        # Never synced — no local edit conflict possible
        return None

    rel_path = str(file_path.relative_to(REPO_ROOT))

    # Hash-based check (preferred) — ignores spurious commit timestamps and
    # only reports a local edit if the file content has actually diverged
    if last_synced_hash is not None:
        if not file_path.exists():
            return None
        if file_content_hash(file_path) != last_synced_hash:
            return f"local content in {rel_path} differs from last synced version"
        return None

    # Legacy fallback: no hash recorded yet (pre-hash sync-meta entry)
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
