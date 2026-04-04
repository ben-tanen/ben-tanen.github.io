"""
Notion → Jekyll sync script.

Fetches changed pages from Notion, transforms markdown, downloads images,
and writes Jekyll-compatible files to _posts/, _drafts/, and _landing-projects/.

Usage:
    op run --env-file=_env/.env -- uv run --project _env/notion_bridge python3 _env/notion_bridge/sync.py [--dry-run] [--force]
"""

import argparse
import os
import re
from pathlib import Path

import httpx
import frontmatter as fm

from config import load_config, REPO_ROOT
from notion_api import throttle, get_pages_by_slug
from sync_meta import (
    load_sync_meta,
    save_sync_meta,
    get_last_synced_at,
    get_synced_status,
    get_oldest_sync_time,
    update_synced,
    page_needs_sync,
    get_dirty_files,
    check_local_edit,
)
from images import content_hash, download_and_save, rewrite_image_urls
from transforms import apply_transforms


# ---------------------------------------------------------------------------
# Notion page property extraction
# ---------------------------------------------------------------------------


def _rich_text_value(prop: dict) -> str | None:
    """Extract plain text from a Notion rich_text property."""
    rt = prop.get("rich_text", [])
    return rt[0]["plain_text"] if rt else None


def _title_value(prop: dict) -> str | None:
    """Extract plain text from a Notion title property."""
    t = prop.get("title", [])
    return t[0]["plain_text"] if t else None


def _relation_ids(prop: dict) -> list[str]:
    """Extract page IDs from a Notion relation property."""
    return [r["id"] for r in prop.get("relation", [])]


def _select_value(prop: dict) -> str | None:
    """Extract name from a Notion select property."""
    sel = prop.get("select")
    return sel["name"] if sel else None


def extract_post_properties(page: dict) -> dict:
    """Extract post properties from a Notion page."""
    props = page["properties"]
    date_prop = props.get("Date", {}).get("date")
    return {
        "notion_id": page["id"],
        "last_edited": page["last_edited_time"],
        "title": _title_value(props.get("Title", {})) or "",
        "slug": _rich_text_value(props.get("Slug", {})) or "",
        "date": date_prop["start"] if date_prop else None,
        "status": _select_value(props.get("Status", {})) or "Draft",
        "reroute_url": props.get("Reroute URL", {}).get("url"),
        "related_project_ids": _relation_ids(props.get("Related Project", {})),
        "cover": page.get("cover"),
    }


def extract_project_properties(page: dict) -> dict:
    """Extract project properties from a Notion page."""
    props = page["properties"]
    return {
        "notion_id": page["id"],
        "last_edited": page["last_edited_time"],
        "title": _title_value(props.get("Title", {})) or "",
        "slug": _rich_text_value(props.get("Slug", {})) or "",
        "landing_order": props.get("Position", {}).get("number"),
        "landing_large": props.get("Large Image?", {}).get("checkbox", False),
        "reroute_url": props.get("Reroute URL", {}).get("url"),
        "related_post_ids": _relation_ids(props.get("Related Post", {})),
        "cover": page.get("cover"),
    }


# ---------------------------------------------------------------------------
# Notion markdown fetching
# ---------------------------------------------------------------------------


def fetch_page_markdown(token: str, api_version: str, page_id: str) -> dict:
    """Fetch markdown for a page via GET /v1/pages/:id/markdown.

    Returns the full response dict with keys:
        markdown, truncated, unknown_block_ids
    """
    headers = {
        "Authorization": f"Bearer {token}",
        "Notion-Version": api_version,
    }
    throttle()
    r = httpx.get(
        f"https://api.notion.com/v1/pages/{page_id}/markdown",
        headers=headers,
        timeout=30,
    )
    r.raise_for_status()
    return r.json()


# ---------------------------------------------------------------------------
# Unknown embed resolution
# ---------------------------------------------------------------------------

# Embed types we know how to handle, keyed by alt text from <unknown> tags
_TWEET_URL_RE = re.compile(r'https?://(?:x\.com|twitter\.com)/\w+/status/(\d+)')


def _clean_embed_url(url: str) -> str:
    """Strip tracking params from embed URLs and normalize domains."""
    url = url.split("?")[0]
    # Twitter widgets.js requires twitter.com, not x.com
    url = url.replace("https://x.com/", "https://twitter.com/")
    return url


def _extract_caption(block: dict) -> str:
    """Extract plain text from a block's caption rich_text array."""
    caption_parts = block.get(block["type"], {}).get("caption", [])
    return "".join(part.get("plain_text", "") for part in caption_parts)


def _build_tweet_include(url: str, caption: str) -> str:
    """Build a tweet include tag, optionally with text and author from caption.

    Caption format: "tweet text\\n\\n- Author Name (@handle)"
    """
    parts = [f'url="{url}"']

    if caption:
        # Split on last "- Author" line
        lines = caption.rstrip().rsplit("\n", 1)
        if len(lines) == 2 and lines[1].strip().startswith("- "):
            text = lines[0].strip().replace("\n", " ")
            author = lines[1].strip()[2:]  # strip "- " prefix
            parts.append(f'text="{text}"')
            parts.append(f'author="{author}"')
        else:
            text = caption.strip().replace("\n", " ")
            parts.append(f'text="{text}"')

    return '{%% include tweet.html %s %%}' % " ".join(parts)


def resolve_unknown_embeds(
    markdown: str,
    unknown_block_ids: list[str],
    token: str,
    api_version: str,
) -> str:
    """Fetch unknown embed blocks and replace <unknown> tags with rendered output.

    Known embed types (tweets, etc.) get transformed. Unknown ones are left as-is
    for the transform pipeline to flag.
    """
    headers = {
        "Authorization": f"Bearer {token}",
        "Notion-Version": api_version,
    }

    for block_id in unknown_block_ids:
        throttle()
        r = httpx.get(
            f"https://api.notion.com/v1/blocks/{block_id}",
            headers=headers,
            timeout=30,
        )
        if r.status_code != 200:
            continue

        block = r.json()
        block_type = block.get("type")
        if block_type != "embed":
            continue

        embed_url = block.get("embed", {}).get("url", "")
        clean_url = _clean_embed_url(embed_url)

        # Find the <unknown> tag for this block ID
        # The URL in the tag contains the block ID (without hyphens)
        block_id_nohyphens = block_id.replace("-", "")
        unknown_pattern = re.compile(
            rf'<unknown\s[^>]*url="[^"]*{block_id_nohyphens}[^"]*"[^>]*alt="([^"]*)"[^>]*/>'
        )
        match = unknown_pattern.search(markdown)
        if not match:
            continue

        alt = match.group(1)
        if alt == "tweet" and _TWEET_URL_RE.search(embed_url):
            caption = _extract_caption(block)
            replacement = _build_tweet_include(clean_url, caption)
            markdown = markdown[:match.start()] + replacement + markdown[match.end():]

    return markdown


# ---------------------------------------------------------------------------
# Video block resolution
# ---------------------------------------------------------------------------

_YOUTUBE_URL_RE = re.compile(
    r'https?://(?:www\.)?(?:youtube\.com/watch\?v=|youtu\.be/)([\w-]+)'
)

# Matches <video src="...">...</video> tags from Notion's markdown API.
# Capture groups: (1) src URL, (2) inner content (for caption text if any).
_VIDEO_TAG_RE = re.compile(r'<video\s+src="([^"]*)">(.*?)</video>', re.DOTALL)


def resolve_video_blocks(
    markdown: str,
    token: str,
    api_version: str,
    page_id: str,
    slug: str,
    dest_dir: Path,
) -> tuple[str, list[str]]:
    """Resolve <video> tags from Notion's markdown export.

    - YouTube/external URLs: rewrite src to the clean URL (transform handles the rest)
    - Uploaded files: fetch the S3 URL via blocks API, download locally, rewrite src

    Returns (transformed_markdown, list_of_errors).
    """
    errors = []
    headers = {
        "Authorization": f"Bearer {token}",
        "Notion-Version": api_version,
    }

    # Fetch all video blocks for this page so we can match file:// attachment IDs
    # to their actual S3 download URLs.
    video_blocks = _fetch_video_blocks(page_id, headers)

    def replace_video(match: re.Match) -> str:
        src = match.group(1)
        caption = match.group(2).strip()

        # YouTube / external URL — pass through for the transform pipeline
        if _YOUTUBE_URL_RE.search(src):
            return match.group(0)

        # Uploaded file — decode the file:// URL to find the attachment ID,
        # look it up in the video blocks we fetched, download it.
        if src.startswith("file://"):
            attachment_id = _extract_attachment_id(src)
            if not attachment_id:
                errors.append(f"Could not parse video attachment ID from: {src[:80]}")
                return ""

            download_url = _find_video_url(attachment_id, video_blocks)
            if not download_url:
                errors.append(f"No video block found for attachment {attachment_id}")
                return ""

            try:
                _, rel_path = _download_video(download_url, slug, dest_dir)
                return f'<video src="{rel_path}">{caption}</video>'
            except Exception as e:
                errors.append(f"Failed to download video {attachment_id}: {e}")
                return match.group(0)

        # Unknown video src format — leave for transform to flag
        return match.group(0)

    markdown = _VIDEO_TAG_RE.sub(replace_video, markdown)
    return markdown, errors


def _fetch_video_blocks(page_id: str, headers: dict) -> list[dict]:
    """Fetch all video-type child blocks for a page."""
    blocks = []
    cursor = None
    while True:
        throttle()
        url = f"https://api.notion.com/v1/blocks/{page_id}/children?page_size=100"
        if cursor:
            url += f"&start_cursor={cursor}"
        r = httpx.get(url, headers=headers, timeout=30)
        if r.status_code != 200:
            break
        data = r.json()
        blocks.extend(b for b in data["results"] if b.get("type") == "video")
        if not data.get("has_more"):
            break
        cursor = data["next_cursor"]
    return blocks


def _extract_attachment_id(file_url: str) -> str | None:
    """Extract the attachment UUID from a Notion file:// encoded URL."""
    from urllib.parse import unquote
    decoded = unquote(file_url)
    # The decoded URL contains JSON with "attachment:<uuid>:filename"
    m = re.search(r'attachment:([0-9a-f-]{36})', decoded)
    return m.group(1) if m else None


def _find_video_url(attachment_id: str, video_blocks: list[dict]) -> str | None:
    """Find the S3 download URL for an attachment ID in fetched video blocks."""
    for block in video_blocks:
        video = block.get("video", {})
        if video.get("type") != "file":
            continue
        file_url = video.get("file", {}).get("url", "")
        # The S3 URL path contains the attachment UUID
        if attachment_id in file_url:
            return file_url
    return None


def _download_video(url: str, slug: str, dest_dir: Path) -> tuple[str, str]:
    """Download a video file, save with content-hash name, return (filename, rel_path)."""
    r = httpx.get(url, timeout=120, follow_redirects=True)
    r.raise_for_status()

    # Determine extension from content-type or URL
    content_type = r.headers.get("content-type", "")
    ext = _video_ext(content_type, url)

    h = content_hash(r.content)
    filename = f"{slug}-{h}{ext}"
    dest = dest_dir / filename

    if not dest.exists():
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_bytes(r.content)

    rel_path = f"/{dest.relative_to(REPO_ROOT)}"
    return filename, rel_path


_VIDEO_MIME_MAP = {
    "video/mp4": ".mp4",
    "video/quicktime": ".mov",
    "video/webm": ".webm",
    "video/ogg": ".ogv",
}


def _video_ext(content_type: str, url: str) -> str:
    """Determine video file extension from content-type or URL."""
    for mime, ext in _VIDEO_MIME_MAP.items():
        if mime in content_type:
            return ext
    # Fall back to URL path
    path = url.split("?")[0]
    m = re.search(r'\.(\w{3,4})$', path)
    if m:
        return f".{m.group(1).lower()}"
    return ".mp4"


# ---------------------------------------------------------------------------
# Cover image handling
# ---------------------------------------------------------------------------


def get_cover_url(cover: dict | None) -> str | None:
    """Extract the downloadable URL from a Notion cover object."""
    if not cover:
        return None
    if cover["type"] == "file":
        return cover["file"]["url"]
    elif cover["type"] == "external":
        return cover["external"]["url"]
    return None


# ---------------------------------------------------------------------------
# Frontmatter generation
# ---------------------------------------------------------------------------


def _localize_url(url: str | None, site_url: str) -> str | None:
    """Convert absolute URL back to relative if it matches the site URL."""
    if url and url.startswith(site_url):
        return url[len(site_url):]
    return url


def build_post_frontmatter(
    post: dict,
    thumbnail_path: str | None,
    project_slug: str | None,
    site_url: str = "",
) -> dict:
    """Build Jekyll frontmatter dict for a post."""
    fm_data = {
        "layout": "post",
        "title": post["title"],
    }
    if post["date"]:
        date_val = post["date"]
        # If date-only (no time), default to noon
        if len(date_val) == 10:
            date_val = f"{date_val} 12:00:00"
        fm_data["date"] = date_val
    if thumbnail_path:
        fm_data["thumbnail"] = thumbnail_path
    if post["reroute_url"]:
        fm_data["reroute-url"] = _localize_url(post["reroute_url"], site_url)
    if project_slug:
        fm_data["related-proj"] = project_slug
    return fm_data


def build_project_frontmatter(
    project: dict,
    landing_img_path: str | None,
    post_stem: str | None,
    site_url: str = "",
) -> dict:
    """Build Jekyll frontmatter dict for a landing project."""
    fm_data = {
        "title": project["title"],
    }
    if project["landing_order"] is not None:
        fm_data["landing-order"] = project["landing_order"]
    if landing_img_path:
        fm_data["landing-img"] = landing_img_path
    fm_data["landing-large"] = project["landing_large"]
    if project["reroute_url"]:
        fm_data["reroute-url"] = _localize_url(project["reroute_url"], site_url)
    if post_stem:
        fm_data["related-post"] = post_stem
    return fm_data


# ---------------------------------------------------------------------------
# File writing
# ---------------------------------------------------------------------------


def _match_key_order(new_data: dict, existing_path: Path) -> dict:
    """Reorder new frontmatter keys to match the existing file's key order.

    Keys present in the existing file come first (in their original order),
    followed by any new keys.
    """
    if not existing_path.exists():
        return new_data
    existing = fm.load(existing_path)
    original_keys = list(existing.metadata.keys())
    ordered = {}
    for key in original_keys:
        if key in new_data:
            ordered[key] = new_data[key]
    for key in new_data:
        if key not in ordered:
            ordered[key] = new_data[key]
    return ordered


def write_jekyll_file(path: Path, frontmatter_data: dict, body: str = ""):
    """Write a Jekyll file with YAML frontmatter and optional body."""
    frontmatter_data = _match_key_order(frontmatter_data, path)
    post = fm.Post(body, **frontmatter_data)
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w") as f:
        f.write(fm.dumps(post, sort_keys=False, width=9999))
        f.write("\n")


# ---------------------------------------------------------------------------
# Validation
# ---------------------------------------------------------------------------


def validate_post(post: dict) -> str | None:
    """Validate required post properties. Returns error string or None."""
    if not post["slug"]:
        return f"post '{post['title'] or post['notion_id']}' has no slug"
    if not post["date"] and post["status"] == "Published":
        return f"post '{post['slug']}' has no date"
    if not post["title"]:
        return f"post with slug '{post['slug']}' has no title"
    return None


def validate_project(project: dict) -> str | None:
    """Validate required project properties. Returns error string or None."""
    if not project["slug"]:
        return f"project '{project['title']}' has no slug"
    if not project["title"]:
        return f"project with slug '{project['slug']}' has no title"
    return None


def check_suspicious_content(
    new_content: str,
    existing_path: Path,
) -> str | None:
    """Check if new content is suspiciously shorter than existing file.

    Returns warning string or None.
    """
    if not existing_path.exists():
        return None
    existing = existing_path.read_text()
    if not existing.strip():
        return None
    if not new_content.strip():
        return f"generated markdown is empty but {existing_path.name} has content"
    ratio = len(new_content) / len(existing)
    if ratio < 0.2:
        return (
            f"generated content is {ratio:.0%} the size of existing "
            f"{existing_path.name} ({len(new_content)} vs {len(existing)} chars)"
        )
    return None


def check_slug_collisions(items: list[dict], label: str) -> dict[str, str]:
    """Check for slug collisions. Returns dict of slug → error message for collisions."""
    seen = {}
    collisions = {}
    for item in items:
        slug = item["slug"]
        if slug in seen:
            msg = f"slug collision: '{slug}' used by multiple {label} pages"
            collisions[slug] = msg
            collisions[seen[slug]] = msg  # also block the first one
        else:
            seen[slug] = slug
    return collisions


# ---------------------------------------------------------------------------
# Sync orchestration
# ---------------------------------------------------------------------------


def _cleanup_old_post_file(post: dict, config: dict, meta: dict, dry_run: bool = False):
    """Remove the old file when a post's status has changed.

    Compares current status to the previously synced status and deletes
    the file at the old location if the output path would differ.
    """
    prev_status = get_synced_status(meta, "posts", post["notion_id"])
    if not prev_status or prev_status == post["status"]:
        return

    slug = post["slug"]
    date_str = post["date"]
    date_prefix = date_str[:10] if date_str else ""

    # Resolve where the old file would have been
    if prev_status == "Staged":
        old_path = REPO_ROOT / config["site"]["drafts_dir"] / f"{slug}.md"
    elif prev_status == "Published":
        old_path = REPO_ROOT / config["site"]["posts_dir"] / f"{date_prefix}-{slug}.md"
    else:
        return  # was Draft — no file to clean up

    if old_path.exists():
        if dry_run:
            print(f"  [DRY RUN] Would delete old file: {old_path.name}")
        else:
            old_path.unlink()
            print(f"  ✓ Cleaned up old file: {old_path.name}")


def sync_post(
    post: dict,
    token: str,
    api_version: str,
    config: dict,
    meta: dict,
    dirty_files: set[str],
    project_slug_by_id: dict[str, str],
    post_stem_by_page_id: dict[str, str] | None = None,
    dry_run: bool = False,
) -> str | None:
    """Sync a single post from Notion to Jekyll.

    Returns error string if hard-blocked, or None on success.
    """
    slug = post["slug"]
    date_str = post["date"]

    # Determine output path based on status
    date_prefix = date_str[:10]
    status = post["status"]
    if status == "Staged":
        out_path = REPO_ROOT / config["site"]["drafts_dir"] / f"{slug}.md"
    else:
        out_path = REPO_ROOT / config["site"]["posts_dir"] / f"{date_prefix}-{slug}.md"

    # Check local edit
    last_synced = get_last_synced_at(meta, "posts", post["notion_id"])
    if out_path.exists():
        local_edit = check_local_edit(out_path, last_synced, dirty_files)
        if local_edit:
            return f"local edit detected: {local_edit}"

    # Fetch markdown
    md_response = fetch_page_markdown(token, api_version, post["notion_id"])

    markdown = md_response.get("markdown", "")

    # Resolve <unknown> embed blocks by fetching their actual URLs from the API
    unknown_ids = md_response.get("unknown_block_ids", [])
    if unknown_ids:
        markdown = resolve_unknown_embeds(markdown, unknown_ids, token, api_version)

    # Download inline images and rewrite URLs
    posts_img_dir = REPO_ROOT / "assets" / "img" / "posts"
    markdown, img_errors = rewrite_image_urls(markdown, slug, posts_img_dir)
    if img_errors:
        return f"image download failed: {'; '.join(img_errors)}"

    # Resolve <video> tags: download uploaded files, clean YouTube URLs
    if "<video " in markdown:
        video_dir = REPO_ROOT / "assets" / "video" / "posts"
        markdown, video_errors = resolve_video_blocks(
            markdown, token, api_version, post["notion_id"], slug, video_dir,
        )
        if video_errors:
            return f"video download failed: {'; '.join(video_errors)}"

    # Apply block transforms (divider → section-break, image → figure include, etc.)
    markdown, unknowns = apply_transforms(
        markdown,
        site_url=config["site"]["url"],
        post_stem_by_page_id=post_stem_by_page_id,
    )
    if unknowns:
        return f"unsupported blocks after transform: {unknowns}"

    # Suspicious content check
    suspicious = check_suspicious_content(markdown, out_path)
    if suspicious:
        return f"suspicious content: {suspicious}"

    # Download cover image (thumbnail)
    thumbnail_path = None
    cover_url = get_cover_url(post["cover"])
    if cover_url:
        thumb_dir = REPO_ROOT / config["site"]["post_thumbnails_dir"]
        try:
            _, thumbnail_path = download_and_save(cover_url, slug, thumb_dir)
        except Exception as e:
            return f"cover image download failed: {e}"

    # Resolve related project slug
    project_slug = None
    if post["related_project_ids"]:
        project_slug = project_slug_by_id.get(post["related_project_ids"][0])

    # Build frontmatter and write
    fm_data = build_post_frontmatter(post, thumbnail_path, project_slug, site_url=config["site"]["url"])

    rel_path = out_path.relative_to(REPO_ROOT)
    if dry_run:
        print(f"  [DRY RUN] Would write post: {rel_path}")
        return None

    write_jekyll_file(out_path, fm_data, markdown)
    print(f"  ✓ Synced post: {rel_path}")

    # Update sync metadata
    update_synced(meta, "posts", post["notion_id"], slug, status=status)
    return None


def sync_project(
    project: dict,
    config: dict,
    meta: dict,
    dirty_files: set[str],
    post_stem_by_id: dict[str, str],
    dry_run: bool = False,
) -> str | None:
    """Sync a single project from Notion to Jekyll.

    Returns error string if hard-blocked, or None on success.
    """
    slug = project["slug"]
    out_path = REPO_ROOT / config["site"]["projects_dir"] / f"{slug}.md"

    # Check local edit
    last_synced = get_last_synced_at(meta, "projects", project["notion_id"])
    if out_path.exists():
        local_edit = check_local_edit(out_path, last_synced, dirty_files)
        if local_edit:
            return f"local edit detected: {local_edit}"

    # Download cover image (landing-img)
    landing_img_path = None
    cover_url = get_cover_url(project["cover"])
    if cover_url:
        proj_thumb_dir = REPO_ROOT / config["site"]["proj_thumbnails_dir"]
        try:
            _, landing_img_path = download_and_save(cover_url, slug, proj_thumb_dir)
        except Exception as e:
            return f"cover image download failed: {e}"

    # Resolve related post stem (e.g., "2026-02-02-sundance-tickets")
    post_stem = None
    if project["related_post_ids"]:
        post_stem = post_stem_by_id.get(project["related_post_ids"][0])

    # Build frontmatter and write (no body content for projects)
    fm_data = build_project_frontmatter(project, landing_img_path, post_stem, site_url=config["site"]["url"])

    if dry_run:
        print(f"  [DRY RUN] Would write project: {out_path.name}")
        return None

    write_jekyll_file(out_path, fm_data)
    print(f"  ✓ Synced project: {out_path.name}")

    # Update sync metadata
    update_synced(meta, "projects", project["notion_id"], slug)
    return None


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------


def main():
    parser = argparse.ArgumentParser(description="Sync Notion pages to Jekyll files")
    parser.add_argument("--dry-run", action="store_true", help="Show what would be synced without writing files")
    parser.add_argument("--force", action="store_true", help="Sync all pages regardless of last_edited_time")
    parser.add_argument("--slug", type=str, help="Only sync the page(s) with this slug")
    args = parser.parse_args()

    config = load_config()
    token = os.environ["NOTION_API_TOKEN"]
    api_version = config["notion"]["api_version"]
    post_db_id = config["notion"]["post_db_id"]
    proj_db_id = config["notion"]["project_db_id"]

    # Load sync metadata
    meta = load_sync_meta()

    # Determine query filters
    slug_filter = args.slug or None
    # Use oldest sync time to filter DB queries (unless --force or --slug)
    last_edited_after = None
    if not args.force and not slug_filter:
        last_edited_after = get_oldest_sync_time(meta)
        if last_edited_after:
            print(f"Filtering to pages edited after {last_edited_after}")

    # Fetch ALL pages (unfiltered) to build complete lookup maps.
    # Needed for inter-post link resolution (Notion page links → {% post_url %})
    # and relation resolution (post → project, project → post).
    print("Fetching Notion pages...")
    all_post_pages = get_pages_by_slug(token, post_db_id)
    all_project_pages = get_pages_by_slug(token, proj_db_id)
    all_posts = [extract_post_properties(p) for p in all_post_pages.values()]
    all_projects = [extract_project_properties(p) for p in all_project_pages.values()]

    # Build lookup maps for relation resolution
    project_slug_by_id = {p["notion_id"]: p["slug"] for p in all_projects}
    post_stem_by_id = {
        p["notion_id"]: f"{p['date'][:10]}-{p['slug']}" for p in all_posts if p["date"]
    }
    # page_id without hyphens → filename stem (for Notion markdown page links)
    post_stem_by_page_id = {
        pid.replace("-", ""): stem for pid, stem in post_stem_by_id.items()
    }

    # Filter to pages that need syncing
    if slug_filter or last_edited_after:
        post_pages = get_pages_by_slug(
            token, post_db_id,
            last_edited_after=last_edited_after,
            slug_filter=slug_filter,
        )
        project_pages = get_pages_by_slug(
            token, proj_db_id,
            last_edited_after=last_edited_after,
            slug_filter=slug_filter,
        )
    else:
        post_pages = all_post_pages
        project_pages = all_project_pages
    print(f"  {len(post_pages)} posts, {len(project_pages)} projects from Notion\n")

    # Extract properties from pages to sync
    posts = [extract_post_properties(p) for p in post_pages.values()]
    projects = [extract_project_properties(p) for p in project_pages.values()]

    # Check for slug collisions
    post_collisions = check_slug_collisions(posts, "post")
    project_collisions = check_slug_collisions(projects, "project")

    # Get dirty files for local edit detection
    dirty_files = get_dirty_files()

    # Filter to changed pages (unless --force or --slug)
    if args.force or slug_filter:
        changed_posts = posts
        changed_projects = projects
    else:
        changed_posts = [
            p for p in posts
            if page_needs_sync(p["last_edited"], get_last_synced_at(meta, "posts", p["notion_id"]))
        ]
        changed_projects = [
            p for p in projects
            if page_needs_sync(p["last_edited"], get_last_synced_at(meta, "projects", p["notion_id"]))
        ]

    print(f"Posts to sync: {len(changed_posts)}")
    print(f"Projects to sync: {len(changed_projects)}\n")

    if not changed_posts and not changed_projects:
        print("Nothing to sync.")
        save_sync_meta(meta)
        return

    # Sync posts
    skipped = []
    synced_count = 0
    if changed_posts:
        print("--- POSTS ---")
        for post in changed_posts:
            # Validation
            val_error = validate_post(post)
            if val_error:
                post_label = post["slug"] or post["title"] or post["notion_id"]
                skipped.append(("post", post_label, val_error))
                print(f"  ✗ Skipped {post_label}: {val_error}")
                continue

            if post["slug"] in post_collisions:
                skipped.append(("post", post["slug"], post_collisions[post["slug"]]))
                print(f"  ✗ Skipped {post['slug']}: {post_collisions[post['slug']]}")
                continue

            # Clean up old file if status changed
            _cleanup_old_post_file(post, config, meta, dry_run=args.dry_run)

            # Skip Draft posts — don't sync, just record status
            if post["status"] == "Draft":
                update_synced(meta, "posts", post["notion_id"], post["slug"], status="Draft")
                print(f"  ⊘ Skipped draft: {post['slug']}")
                continue

            error = sync_post(
                post, token, api_version, config, meta, dirty_files,
                project_slug_by_id, post_stem_by_page_id,
                dry_run=args.dry_run,
            )
            if error:
                skipped.append(("post", post["slug"], error))
                print(f"  ✗ Skipped {post['slug']}: {error}")
            else:
                synced_count += 1
        print()

    # Sync projects
    if changed_projects:
        print("--- PROJECTS ---")
        for project in changed_projects:
            val_error = validate_project(project)
            if val_error:
                skipped.append(("project", project["slug"] or project["notion_id"], val_error))
                print(f"  ✗ Skipped {project['slug']}: {val_error}")
                continue

            if project["slug"] in project_collisions:
                skipped.append(("project", project["slug"], project_collisions[project["slug"]]))
                print(f"  ✗ Skipped {project['slug']}: {project_collisions[project['slug']]}")
                continue

            error = sync_project(
                project, config, meta, dirty_files,
                post_stem_by_id, dry_run=args.dry_run,
            )
            if error:
                skipped.append(("project", project["slug"], error))
                print(f"  ✗ Skipped {project['slug']}: {error}")
            else:
                synced_count += 1
        print()

    # Save sync metadata
    if not args.dry_run:
        save_sync_meta(meta)

    # Summary
    print("--- SUMMARY ---")
    print(f"  Synced: {synced_count}")
    print(f"  Skipped: {len(skipped)}")
    if skipped:
        print()
        for item_type, slug, reason in skipped:
            print(f"  ⚠ [{item_type}] {slug}: {reason}")


if __name__ == "__main__":
    main()
