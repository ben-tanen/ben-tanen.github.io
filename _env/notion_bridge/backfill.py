"""
Backfill script: creates Notion pages from existing Jekyll posts and landing projects.

Reads _posts/ and _landing-projects/ frontmatter, checks for existing Notion pages
by slug, and creates missing ones with properties + covers + relations.

Usage:
    op run --env-file=_env/.env -- uv run --project _env/notion_bridge python3 _env/notion_bridge/backfill.py [--dry-run]
"""

import argparse
import os
import re

from notion_client import Client

from config import load_config, REPO_ROOT
from notion_api import throttled_request, get_pages_by_slug, build_cover_url
from jekyll import parse_posts, parse_projects


# ---------------------------------------------------------------------------
# Notion page creation (backfill-specific)
# ---------------------------------------------------------------------------


def create_post_page(
    notion: Client,
    db_id: str,
    post: dict,
    site_url: str,
    project_page_id: str | None = None,
    dry_run: bool = False,
) -> str | None:
    """Create a Notion page in the Post DB for a Jekyll post."""
    properties = {
        "Title": {"title": [{"text": {"content": post["title"]}}]},
        "Slug": {"rich_text": [{"text": {"content": post["slug"]}}]},
        "Date": {"date": {"start": post["date"]}},
        "Draft?": {"checkbox": post["draft"]},
    }
    if post["reroute_url"]:
        url = post["reroute_url"]
        if url.startswith("/"):
            url = f"{site_url}{url}"
        properties["Reroute URL"] = {"url": url}
    if project_page_id:
        properties["Related Project"] = {
            "relation": [{"id": project_page_id}]
        }

    cover_url = build_cover_url(site_url, post["thumbnail"])

    if dry_run:
        print(f"  [DRY RUN] Would create post: {post['title']} (slug: {post['slug']})")
        return None

    page_data = {"parent": {"database_id": db_id}, "properties": properties}
    if cover_url:
        page_data["cover"] = {"type": "external", "external": {"url": cover_url}}

    result = throttled_request(notion.pages.create, **page_data)
    print(f"  ✓ Created post: {post['title']} (slug: {post['slug']})")
    return result["id"]


def create_project_page(
    notion: Client,
    db_id: str,
    project: dict,
    site_url: str,
    post_page_id: str | None = None,
    dry_run: bool = False,
) -> str | None:
    """Create a Notion page in the Project DB for a Jekyll landing project."""
    properties = {
        "Title": {"title": [{"text": {"content": project["title"]}}]},
        "Slug": {"rich_text": [{"text": {"content": project["slug"]}}]},
        "Large Image?": {"checkbox": project["landing_large"]},
    }
    if project["landing_order"] is not None:
        properties["Position"] = {"number": project["landing_order"]}
    if project["reroute_url"]:
        url = project["reroute_url"]
        if url.startswith("/"):
            url = f"{site_url}{url}"
        properties["Reroute URL"] = {"url": url}
    if post_page_id:
        properties["Related Post"] = {
            "relation": [{"id": post_page_id}]
        }

    cover_url = build_cover_url(site_url, project["landing_img"])

    if dry_run:
        print(f"  [DRY RUN] Would create project: {project['title']} (slug: {project['slug']})")
        return None

    page_data = {"parent": {"database_id": db_id}, "properties": properties}
    if cover_url:
        page_data["cover"] = {"type": "external", "external": {"url": cover_url}}

    result = throttled_request(notion.pages.create, **page_data)
    print(f"  ✓ Created project: {project['title']} (slug: {project['slug']})")
    return result["id"]


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------


def main():
    parser = argparse.ArgumentParser(description="Backfill Notion DBs from Jekyll files")
    parser.add_argument("--dry-run", action="store_true", help="Log what would be created without hitting the API")
    args = parser.parse_args()

    config = load_config()
    site_url = config["site"]["url"]
    post_db_id = config["notion"]["post_db_id"]
    proj_db_id = config["notion"]["project_db_id"]

    token = os.environ["NOTION_API_TOKEN"]
    notion = Client(auth=token)

    # Parse Jekyll files
    posts = parse_posts(REPO_ROOT / config["site"]["posts_dir"])
    projects = parse_projects(REPO_ROOT / config["site"]["projects_dir"])
    print(f"Found {len(posts)} posts and {len(projects)} projects in Jekyll repo\n")

    # Get existing Notion pages (always fetch, even in dry-run, for accurate counts)
    print("Fetching existing Notion pages...")
    existing_posts = get_pages_by_slug(token, post_db_id)
    existing_projects = get_pages_by_slug(token, proj_db_id)
    print(f"  {len(existing_posts)} posts and {len(existing_projects)} projects already in Notion\n")

    # Phase 1: Create project pages first (posts may reference them)
    print("--- PROJECTS ---")
    new_project_ids = {}  # slug -> notion page id
    skipped_projects = 0
    for proj in projects:
        if proj["slug"] in existing_projects:
            skipped_projects += 1
            new_project_ids[proj["slug"]] = existing_projects[proj["slug"]]["id"]
            continue
        page_id = create_project_page(
            notion, proj_db_id, proj, site_url, dry_run=args.dry_run
        )
        if page_id:
            new_project_ids[proj["slug"]] = page_id
    if skipped_projects:
        print(f"  ({skipped_projects} projects already exist, skipped)")
    print()

    # Phase 2: Create post pages (with relation to project if applicable)
    print("--- POSTS ---")
    new_post_ids = {}  # slug -> notion page id
    skipped_posts = 0
    for post in posts:
        if post["slug"] in existing_posts:
            skipped_posts += 1
            new_post_ids[post["slug"]] = existing_posts[post["slug"]]["id"]
            continue
        # Resolve related project
        proj_page_id = None
        if post["related_proj"] and post["related_proj"] in new_project_ids:
            proj_page_id = new_project_ids[post["related_proj"]]
        page_id = create_post_page(
            notion, post_db_id, post, site_url,
            project_page_id=proj_page_id, dry_run=args.dry_run,
        )
        if page_id:
            new_post_ids[post["slug"]] = page_id
    if skipped_posts:
        print(f"  ({skipped_posts} posts already exist, skipped)")
    print()

    # Phase 3: Back-patch project relations to posts
    print("--- LINKING PROJECTS → POSTS ---")
    linked = 0
    for proj in projects:
        if not proj["related_post"]:
            continue
        # Derive post slug from related-post (strip date prefix)
        post_slug = re.sub(r"^\d{4}-\d{2}-\d{2}-", "", proj["related_post"])
        post_page_id = new_post_ids.get(post_slug)
        proj_page_id = new_project_ids.get(proj["slug"])
        if not post_page_id or not proj_page_id:
            continue
        # Skip if already linked (existing project)
        if proj["slug"] in existing_projects:
            existing = existing_projects[proj["slug"]]
            existing_relations = existing["properties"].get("Related Post", {}).get("relation", [])
            if any(r["id"] == post_page_id for r in existing_relations):
                continue
        if args.dry_run:
            print(f"  [DRY RUN] Would link {proj['slug']} → {post_slug}")
            linked += 1
            continue
        throttled_request(
            notion.pages.update,
            page_id=proj_page_id,
            properties={
                "Related Post": {"relation": [{"id": post_page_id}]}
            },
        )
        print(f"  ✓ Linked {proj['slug']} → {post_slug}")
        linked += 1
    if linked == 0:
        print("  (no new links needed)")
    print()

    print("Done!")


if __name__ == "__main__":
    main()
