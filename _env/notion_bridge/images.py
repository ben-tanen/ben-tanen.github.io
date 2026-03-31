"""Image downloading, content-hashing, and path management."""

import hashlib
import re
from pathlib import Path

import httpx

from config import REPO_ROOT


def content_hash(data: bytes) -> str:
    """Return first 8 chars of SHA-256 hex digest."""
    return hashlib.sha256(data).hexdigest()[:8]


def download_image(url: str) -> tuple[bytes, str]:
    """Download an image and return (bytes, file_extension).

    Raises on non-200 response.
    """
    r = httpx.get(url, timeout=30, follow_redirects=True)
    r.raise_for_status()

    # Determine extension from content-type or URL
    content_type = r.headers.get("content-type", "")
    ext = _ext_from_content_type(content_type)
    if not ext:
        ext = _ext_from_url(url)
    if not ext:
        ext = ".png"  # safe default

    return r.content, ext


def _ext_from_content_type(ct: str) -> str | None:
    mapping = {
        "image/png": ".png",
        "image/jpeg": ".jpg",
        "image/jpg": ".jpg",
        "image/gif": ".gif",
        "image/webp": ".webp",
        "image/svg+xml": ".svg",
    }
    for mime, ext in mapping.items():
        if mime in ct:
            return ext
    return None


def _ext_from_url(url: str) -> str | None:
    # Strip query params, get extension from path
    path = url.split("?")[0]
    m = re.search(r'\.(\w{3,4})$', path)
    if m:
        ext = f".{m.group(1).lower()}"
        if ext in {".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"}:
            return ".jpg" if ext == ".jpeg" else ext
    return None


def download_and_save(
    url: str,
    slug: str,
    dest_dir: Path,
) -> tuple[str, str]:
    """Download an image, save with content-hash name, return (filename, local_path).

    The local_path is relative to REPO_ROOT (for use in frontmatter/markdown).
    """
    data, ext = download_image(url)
    h = content_hash(data)
    filename = f"{slug}-{h}{ext}"
    dest = dest_dir / filename

    # Skip write if identical file exists
    if not dest.exists():
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_bytes(data)

    rel_path = f"/{dest.relative_to(REPO_ROOT)}"
    return filename, rel_path


def rewrite_image_urls(
    markdown: str,
    slug: str,
    dest_dir: Path,
) -> tuple[str, list[str]]:
    """Download all inline images in markdown, rewrite URLs to local paths.

    Returns (transformed_markdown, list_of_errors).
    Errors are per-image; the caller decides whether to hard-block.
    """
    errors = []
    img_pattern = re.compile(r'!\[([^\]]*)\]\(([^)]+)\)')

    def replace_image(match: re.Match) -> str:
        alt_text = match.group(1)
        url = match.group(2)

        # Skip already-local paths
        if not url.startswith("http"):
            return match.group(0)

        try:
            filename, rel_path = download_and_save(url, slug, dest_dir)
            return f"![{alt_text}]({rel_path})"
        except Exception as e:
            errors.append(f"Failed to download {url}: {e}")
            return match.group(0)  # leave original on failure

    result = img_pattern.sub(replace_image, markdown)
    return result, errors
