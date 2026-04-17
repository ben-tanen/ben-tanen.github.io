"""Shared Notion API helpers: throttling, database queries, page lookups."""

import time

import httpx
from notion_client import Client


# ---------------------------------------------------------------------------
# Throttling (~3 requests/sec)
# ---------------------------------------------------------------------------

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


# ---------------------------------------------------------------------------
# Database queries
# ---------------------------------------------------------------------------


def query_database(
    token: str,
    db_id: str,
    last_edited_after: str | None = None,
    slug_filter: str | None = None,
) -> list[dict]:
    """Query pages in a Notion DB using the REST API directly.

    Uses httpx instead of notion_client because the SDK removed databases.query.

    Args:
        last_edited_after: ISO timestamp — only return pages edited after this time.
        slug_filter: only return pages with this exact slug value.
    """
    headers = {
        "Authorization": f"Bearer {token}",
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
    }

    # Build filter
    filters = []
    if last_edited_after:
        filters.append({
            "timestamp": "last_edited_time",
            "last_edited_time": {"after": last_edited_after},
        })
    if slug_filter:
        filters.append({
            "property": "Slug",
            "rich_text": {"equals": slug_filter},
        })

    pages = []
    cursor = None
    while True:
        body = {"page_size": 100}
        if filters:
            body["filter"] = {"and": filters} if len(filters) > 1 else filters[0]
        if cursor:
            body["start_cursor"] = cursor
        throttle()
        r = httpx.post(
            f"https://api.notion.com/v1/databases/{db_id}/query",
            headers=headers,
            json=body,
            timeout=30,
        )
        r.raise_for_status()
        data = r.json()
        pages.extend(data["results"])
        if not data.get("has_more"):
            break
        cursor = data["next_cursor"]
    return pages


def get_pages_by_slug(
    token: str,
    db_id: str,
    last_edited_after: str | None = None,
    slug_filter: str | None = None,
) -> dict[str, dict]:
    """Query pages in a Notion DB and return a dict keyed by slug."""
    results = query_database(
        token, db_id,
        last_edited_after=last_edited_after,
        slug_filter=slug_filter,
    )
    pages = {}
    for page in results:
        slug_prop = page["properties"].get("Slug", {})
        rich_text = slug_prop.get("rich_text", [])
        if rich_text:
            slug = rich_text[0]["plain_text"]
            pages[slug] = page
    return pages


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def build_cover_url(site_url: str, img_path: str | None) -> str | None:
    """Convert a local image path to a full URL on the live site."""
    if not img_path:
        return None
    if img_path.startswith("http"):
        return img_path
    return f"{site_url}/{img_path.lstrip('/')}"


def init_client(token: str) -> Client:
    """Create a Notion SDK client."""
    return Client(auth=token)
