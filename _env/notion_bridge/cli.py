"""
Notion Bridge CLI — single entrypoint for backfill + sync.

Usage:
    # Full run (backfill then sync)
    op run --env-file=_env/.env -- uv run --project _env/notion_bridge python3 _env/notion_bridge/cli.py

    # Sync only, single page
    op run --env-file=_env/.env -- uv run --project _env/notion_bridge python3 _env/notion_bridge/cli.py --slug sundance-tickets

    # Dry run
    op run --env-file=_env/.env -- uv run --project _env/notion_bridge python3 _env/notion_bridge/cli.py --dry-run

    # Skip backfill (sync only)
    op run --env-file=_env/.env -- uv run --project _env/notion_bridge python3 _env/notion_bridge/cli.py --no-backfill

    # Backfill only (no sync)
    op run --env-file=_env/.env -- uv run --project _env/notion_bridge python3 _env/notion_bridge/cli.py --backfill-only
"""

import subprocess
import sys
from pathlib import Path

BRIDGE_DIR = Path(__file__).resolve().parent


def main():
    import argparse

    parser = argparse.ArgumentParser(description="Notion Bridge: backfill + sync")
    parser.add_argument("--dry-run", action="store_true", help="Pass --dry-run to both backfill and sync")
    parser.add_argument("--force", action="store_true", help="Pass --force to sync (sync all pages)")
    parser.add_argument("--slug", type=str, help="Pass --slug to sync (single page)")
    parser.add_argument("--no-backfill", action="store_true", help="Skip backfill, run sync only")
    parser.add_argument("--backfill-only", action="store_true", help="Run backfill only, skip sync")
    args = parser.parse_args()

    # Backfill
    if not args.no_backfill:
        print("=" * 50)
        print("BACKFILL")
        print("=" * 50, flush=True)
        backfill_cmd = [sys.executable, "-u", str(BRIDGE_DIR / "backfill.py")]
        if args.dry_run:
            backfill_cmd.append("--dry-run")
        result = subprocess.run(backfill_cmd)
        if result.returncode != 0:
            print(f"\nBackfill failed (exit code {result.returncode})")
            sys.exit(result.returncode)
        print()

    # Sync
    if not args.backfill_only:
        print("=" * 50)
        print("SYNC")
        print("=" * 50, flush=True)
        sync_cmd = [sys.executable, "-u", str(BRIDGE_DIR / "sync.py")]
        if args.dry_run:
            sync_cmd.append("--dry-run")
        if args.force:
            sync_cmd.append("--force")
        if args.slug:
            sync_cmd.extend(["--slug", args.slug])
        result = subprocess.run(sync_cmd)
        if result.returncode != 0:
            print(f"\nSync failed (exit code {result.returncode})")
            sys.exit(result.returncode)


if __name__ == "__main__":
    main()
