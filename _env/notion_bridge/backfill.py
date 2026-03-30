"""
Backfill script: creates Notion pages from existing Jekyll posts and landing projects.

Reads _posts/ and _landing-projects/ frontmatter, checks for existing Notion pages
by slug, and creates missing ones with properties + covers + relations.

Usage:
    op run --env-file=_env/.env -- uv run python3 _env/notion_bridge/backfill.py [--dry-run]
"""

import argparse
import os
import re
import time
from pathlib import Path

import httpx
import frontmatter
import yaml
from notion_client import Client

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------

REPO_ROOT = Path(__file__).resolve().parent.parent.parent
CONFIG_PATH = Path(__file__).resolve().parent / "config.yml"


def load_config():
    with open(CONFIG_PATH) as f:
        return yaml.safe_load(f)


# ---------------------------------------------------------------------------
# Jekyll parsing
# ---------------------------------------------------------------------------


def parse_jekyll_posts(posts_dir: Path) -> list[dict]:
    """Parse all _posts/*.md files and return frontmatter data."""
    posts = []
    for f in sorted(posts_dir.glob("*.md")):
        post = frontmatter.load(f)
        stem = f.stem  # e.g., "2023-12-01-wrapped-sound-town"
        m = re.match(r"(\d{4}-\d{2}-\d{2})-(.+)", stem)
        if not m:
            print(f"  ⚠ Skipping {f.name}: can't parse date from filename")
            continue
        date_str, slug = m.groups()
        posts.append({
            "filename": f.name,
            "stem": stem,
            "slug": slug,
            "date": date_str,
            "title": post.get("title", ""),
            "reroute_url": post.get("reroute-url"),
            "related_proj": post.get("related-proj"),
            "thumbnail": post.get("thumbnail"),
            "draft": post.get("draft", False),
        })
    return posts


def parse_jekyll_projects(projects_dir: Path) -> list[dict]:
    """Parse all _landing-projects/*.md files and return frontmatter data."""
    projects = []
    for f in sorted(projects_dir.glob("*.md")):
        proj = frontmatter.load(f)
        slug = f.stem
        projects.append({
            "filename": f.name,
            "slug": slug,
            "title": proj.get("title", ""),
            "landing_order": proj.get("landing-order"),
            "landing_img": proj.get("landing-img"),
            "landing_large": proj.get("landing-large", False),
            "reroute_url": proj.get("reroute-url"),
            "related_post": proj.get("related-post"),
        })
    return projects


# ---------------------------------------------------------------------------
# Notion helpers
# ---------------------------------------------------------------------------

# Throttle to ~3 requests/sec
_last_request_time = 0.0


def throttle():
    global _last_request_time
    elapsed = time.time() - _last_request_time
    if elapsed < 0.35:
        time.sleep(0.35 - elapsed)
    _last_request_time = time.time()


def throttled_request(fn, *args, **kwargs):
    throttle()
    return fn(*args, **kwargs)


def query_notion_database(token: str, db_id: str) -> list[dict]:
    """Query all pages in a Notion DB using the REST API directly."""
    headers = {
        "Authorization": f"Bearer {token}",
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
    }
    pages = []
    cursor = None
    while True:
        body = {"page_size": 100}
        if cursor:
            body["start_cursor"] = cursor
        throttle()
        r = httpx.post(
            f"https://api.notion.com/v1/databases/{db_id}/query",
            headers=headers,
            json=body,
        )
        r.raise_for_status()
        data = r.json()
        pages.extend(data["results"])
        if not data.get("has_more"):
            break
        cursor = data["next_cursor"]
    return pages


def get_existing_notion_pages(token: str, db_id: str) -> dict[str, dict]:
    """Query all pages in a Notion DB and return a dict keyed by slug."""
    results = query_notion_database(token, db_id)
    pages = {}
    for page in results:
        slug_prop = page["properties"].get("Slug", {})
        rich_text = slug_prop.get("rich_text", [])
        if rich_text:
            slug = rich_text[0]["plain_text"]
            pages[slug] = page
    return pages


def build_cover_url(site_url: str, img_path: str | None) -> str | None:
    """Convert a local image path to a full URL on the live site."""
    if not img_path:
        return None
    # Some paths are already absolute URLs
    if img_path.startswith("http"):
        return img_path
    # Strip leading slash and build URL
    return f"{site_url}/{img_path.lstrip('/')}"


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
        # Resolve relative URLs to absolute for Notion
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
    posts = parse_jekyll_posts(REPO_ROOT / config["site"]["posts_dir"])
    projects = parse_jekyll_projects(REPO_ROOT / config["site"]["projects_dir"])
    print(f"Found {len(posts)} posts and {len(projects)} projects in Jekyll repo\n")

    # Get existing Notion pages (always fetch, even in dry-run, for accurate counts)
    print("Fetching existing Notion pages...")
    existing_posts = get_existing_notion_pages(token, post_db_id)
    existing_projects = get_existing_notion_pages(token, proj_db_id)
    print(f"  {len(existing_posts)} posts and {len(existing_projects)} projects already in Notion\n")

    # Build slug -> project mapping for relation resolution
    project_by_slug = {p["slug"]: p for p in projects}

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
    # (projects created in Phase 1 didn't have post IDs yet for related-post)
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
