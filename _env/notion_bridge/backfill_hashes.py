"""One-shot: seed .sync-meta.json with content hashes of current local files.

Run this once after upgrading to hash-based local-edit detection, if you
want to adopt Option A (trust current on-disk state as the baseline).

Usage:
    op run --env-file=_env/.env -- uv run --project _env/notion_bridge \
        python3 _env/notion_bridge/backfill_hashes.py
"""

from pathlib import Path

from config import REPO_ROOT, load_config
from sync_meta import (
    file_content_hash,
    load_sync_meta,
    save_sync_meta,
)


def resolve_post_path(slug: str, config: dict) -> Path | None:
    """Find the local Jekyll file for a post by slug."""
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


def main():
    config = load_config()
    meta = load_sync_meta()

    counts = {"hashed": 0, "already_hashed": 0, "missing_file": 0}

    for collection, resolver in (
        ("posts", resolve_post_path),
        ("projects", resolve_project_path),
    ):
        for page_id, entry in meta.get(collection, {}).items():
            slug = entry.get("slug")
            if not slug:
                continue
            if entry.get("last_synced_hash"):
                counts["already_hashed"] += 1
                continue
            path = resolver(slug, config)
            if path is None:
                print(f"  ⚠ [{collection}] {slug}: no local file found — skipping")
                counts["missing_file"] += 1
                continue
            entry["last_synced_hash"] = file_content_hash(path)
            rel = path.relative_to(REPO_ROOT)
            print(f"  ✓ [{collection}] {slug}: hashed {rel}")
            counts["hashed"] += 1

    save_sync_meta(meta)

    print()
    print("--- SUMMARY ---")
    print(f"  Hashed:         {counts['hashed']}")
    print(f"  Already hashed: {counts['already_hashed']}")
    print(f"  Missing file:   {counts['missing_file']}")


if __name__ == "__main__":
    main()
