"""Jekyll file parsing: read posts and landing projects from frontmatter."""

import re
from pathlib import Path

import frontmatter


def parse_posts(posts_dir: Path) -> list[dict]:
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


def parse_drafts(drafts_dir: Path) -> list[dict]:
    """Parse all _drafts/*.md files and return frontmatter data."""
    drafts = []
    if not drafts_dir.exists():
        return drafts
    for f in sorted(drafts_dir.glob("*.md")):
        post = frontmatter.load(f)
        slug = f.stem  # drafts are just "slug.md", no date prefix
        date_str = post.get("date")
        if date_str:
            date_str = str(date_str)[:10]
        drafts.append({
            "filename": f.name,
            "stem": slug,
            "slug": slug,
            "date": date_str,
            "title": post.get("title", ""),
            "reroute_url": post.get("reroute-url"),
            "related_proj": post.get("related-proj"),
            "thumbnail": post.get("thumbnail"),
            "draft": True,
        })
    return drafts


def parse_projects(projects_dir: Path) -> list[dict]:
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
