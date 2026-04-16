"""Block transforms: convert Notion markdown patterns to Jekyll-compatible output.

Resolution order:
1. Check block_transforms config for a custom mapping → use it
2. Fall back to default markdown (passthrough)
3. Neither → flag as unsupported

Currently handles:
- divider (---) → {% include section-break.html %}
- image (![...](...)) → {% include figure.html %} with caption metadata parsing
"""

import re

from config import load_config


def load_block_transforms() -> dict:
    """Load block_transforms from config.yml, or empty dict if not configured."""
    config = load_config()
    return config.get("block_transforms", {})


# ---------------------------------------------------------------------------
# Image caption metadata parsing
# ---------------------------------------------------------------------------


def parse_image_caption(caption: str) -> dict[str, str]:
    """Parse Notion image caption into key-value metadata.

    Syntax:
        "alt: description | caption: Source | link: /path | auto-link"
        Plain text (no pipes) → treated as alt text

    Returns dict of params (e.g., {"alt": "description", "caption": "Source"}).
    """
    if not caption:
        return {}

    # Unescape Notion's pipe escaping before parsing
    caption = caption.replace("\\|", "|")

    # No pipes and no leading "key:" → entire caption is plain alt text
    if "|" not in caption and not re.match(r'^[a-z-]+\s*:', caption):
        return {"alt": caption.strip()}

    params = {}
    parts = caption.split("|")
    for part in parts:
        part = part.strip()
        if ":" in part:
            key, value = part.split(":", 1)
            value = value.strip()
            # Strip markdown link syntax: [text](url) → url
            md_link = re.match(r'^\[([^\]]*)\]\(([^)]+)\)$', value)
            if md_link:
                value = md_link.group(2)
            params[key.strip()] = value
        else:
            # Bare key (boolean flag)
            if part:
                params[part.strip()] = "true"
    return params


def _quote_param(value: str) -> str:
    """Quote a value for a Liquid include tag, choosing quotes to avoid escaping."""
    if '"' in value:
        return f"'{value}'"
    return f'"{value}"'


def build_figure_include(src: str, params: dict[str, str]) -> str:
    """Build a Jekyll {% include figure.html %} tag from params.

    Only includes params that are explicitly set. Keeps generated markdown clean.
    """
    parts = [f'src="{src}"']
    # Emit params in a stable order
    param_order = ["alt", "caption", "link", "autolink", "width", "style"]
    for key in param_order:
        if key in params:
            parts.append(f'{key}={_quote_param(params[key])}')
    # Any remaining params not in the standard order
    for key, value in params.items():
        if key not in param_order:
            parts.append(f'{key}={_quote_param(value)}')

    return '{%% include figure.html %s %%}' % " ".join(parts)


# ---------------------------------------------------------------------------
# Inline span markers
# ---------------------------------------------------------------------------

_SPAN_ATTR_RE = re.compile(r'(?:#([\w-]+))|(\.[\w-]+)')


def _replace_span_marker(match: re.Match) -> str:
    """Convert a {{span...}} marker to an HTML <span> tag.

    Parses CSS-selector-style attributes: #id and .class (multiple allowed).
    """
    attrs_str = match.group(1)
    content = match.group(2)

    span_id = None
    classes = []
    for m in _SPAN_ATTR_RE.finditer(attrs_str):
        if m.group(1):
            span_id = m.group(1)
        elif m.group(2):
            classes.append(m.group(2)[1:])  # strip leading dot

    parts = ["<span"]
    if span_id:
        parts.append(f' id="{span_id}"')
    if classes:
        parts.append(f' class="{" ".join(classes)}"')
    parts.append(f">{content}</span>")
    return "".join(parts)


# ---------------------------------------------------------------------------
# Main transform pipeline
# ---------------------------------------------------------------------------


def apply_transforms(
    markdown: str,
    site_url: str = "",
    post_stem_by_page_id: dict[str, str] | None = None,
) -> tuple[str, list[str], dict[str, bool]]:
    """Apply all block transforms to markdown content.

    Args:
        post_stem_by_page_id: map of Notion page ID (no hyphens) → Jekyll filename
            stem (e.g. "2022-09-27-howdy-update"). Used to resolve inter-post links.

    Returns (transformed_markdown, list_of_unknown_block_descriptions, flags).
    """
    transforms = load_block_transforms()
    unknowns = []
    flags = {}

    # Transform 1: dividers
    divider_replacement = transforms.get("divider", "{% include section-break.html %}")
    # Match --- on its own line (with optional surrounding whitespace)
    markdown = re.sub(
        r'^---\s*$',
        divider_replacement,
        markdown,
        flags=re.MULTILINE,
    )

    # Transform 2: images → figure includes
    # Match markdown images: ![alt](url)
    # Alt text group handles one level of bracket nesting (for markdown links
    # inside Notion image captions, e.g. link: [text](url) | width: 600)
    img_pattern = re.compile(r'^[ \t]*!\[((?:[^\[\]]|\[[^\]]*\])*)\]\(([^)]+)\)\s*$', re.MULTILINE)

    def transform_image(match: re.Match) -> str:
        alt_text = match.group(1)
        src = match.group(2)
        params = parse_image_caption(alt_text)
        return build_figure_include(src, params)

    markdown = img_pattern.sub(transform_image, markdown)

    # Normalize block spacing: ensure blank lines between blocks.
    # Notion's markdown API uses single \n between blocks, but Jekyll/kramdown
    # needs \n\n to treat them as separate block-level elements.
    # Process only outside of fenced code blocks to preserve their formatting.
    markdown = _add_block_spacing(markdown)

    # Transform 3: raw code blocks → inline content (strip fences)
    # Runs AFTER block spacing so raw content's internal newlines are preserved.
    # Allows leading whitespace (tabs/spaces) for fences inside columns.
    markdown = re.sub(
        r'^[ \t]*```(?:raw|plain text|plaintext|text)\n(.*?)[ \t]*```',
        lambda m: m.group(1).rstrip('\n'),
        markdown,
        flags=re.MULTILINE | re.DOTALL,
    )

    # Transform: Notion inline equations $`...`$ → \\(...\\) for MathJax
    # Must run BEFORE columns: column markdown is rendered via md.markdown(),
    # which halves the escaping (\\( → \(), giving MathJax the \(...\) it expects.
    markdown, has_equations = _transform_equations(markdown)
    if has_equations:
        flags["mathjax"] = True

    # Transform: inline span markers → <span> tags
    # Must run BEFORE columns: md.markdown() converts backticks to <code> tags,
    # which breaks the backtick-wrapped marker pattern.
    # `{{span#id.class1.class2}}`content`{{/span}}` → <span id="id" class="class1 class2">content</span>
    markdown = re.sub(
        r'`\{\{span([^}]*)\}\}`(.*?)`\{\{/span\}\}`',
        _replace_span_marker,
        markdown,
        flags=re.DOTALL,
    )

    # Transform 4: columns → div.columns layout
    markdown = _transform_columns(markdown)

    # Transform 5: callouts with known emojis
    markdown = _transform_callouts(markdown)

    # Transform 6: video tags
    markdown = _transform_videos(markdown)

    # Transform: HTML tables → markdown pipe tables
    markdown = _transform_html_tables(markdown)

    # Transform: unescape \$ → $
    markdown = markdown.replace(r'\$', '$')

    # Strip <unknown> tags (Notion embed blocks the API can't convert)
    unknown_tags = re.findall(r'<unknown\s[^>]*alt="([^"]*)"[^>]*/>', markdown)
    if unknown_tags:
        unknowns.extend(f"unsupported embed: {alt}" for alt in unknown_tags)
    markdown = re.sub(r'<unknown\s[^>]*/>\n?', '', markdown)

    # Strip <empty-block/> tags
    markdown = re.sub(r'<empty-block/>\n?', '', markdown)

    # Localize absolute URLs back to relative paths
    if site_url:
        markdown = markdown.replace(f"]({site_url}/", "](/")
        markdown = markdown.replace(f'href="{site_url}/', 'href="/')

    # Transform 6: merge fragmented italic/bold markers around links
    # Notion's markdown API breaks *text [link](url) text* into
    # *text *[*link*](url)* text* — merge them back together.
    # Pattern matches the exact fragmentation: *[*...*](url)* or **[**...**](url)**
    markdown = re.sub(
        r'(\*{1,2})\[(\1)(.*?)\2\]\(([^)]+)\)\1',
        r'[\3](\4)',
        markdown,
    )

    # Transform 7: resolve Notion page links
    # Notion markdown exports inter-page links as (/hex-id?pvs=25)
    if post_stem_by_page_id is None:
        post_stem_by_page_id = {}
    notion_link_pattern = re.compile(r'\[([^\]]*)\]\(/([0-9a-f]{32})\?[^)]*\)')
    notion_href_pattern = re.compile(r'href="/([0-9a-f]{32})\?[^"]*"')
    unresolved_notion_links = []

    def resolve_notion_link(match: re.Match) -> str:
        text = match.group(1)
        page_id = match.group(2)
        stem = post_stem_by_page_id.get(page_id)
        if stem:
            return f'[{text}]({{% post_url {stem} %}})'
        unresolved_notion_links.append(page_id)
        return match.group(0)

    def resolve_notion_href(match: re.Match) -> str:
        page_id = match.group(1)
        stem = post_stem_by_page_id.get(page_id)
        if stem:
            return f'href="{{% post_url {stem} %}}"'
        unresolved_notion_links.append(page_id)
        return match.group(0)

    markdown = notion_link_pattern.sub(resolve_notion_link, markdown)
    markdown = notion_href_pattern.sub(resolve_notion_href, markdown)
    if unresolved_notion_links:
        unknowns.append(f"unresolved Notion page links: {', '.join(unresolved_notion_links)}")

    return markdown, unknowns, flags


# ---------------------------------------------------------------------------
# Video transforms
# ---------------------------------------------------------------------------

_YOUTUBE_ID_RE = re.compile(
    r'https?://(?:www\.)?(?:youtube\.com/watch\?v=|youtu\.be/)([\w-]+)'
)

_VIDEO_TAG_RE = re.compile(r'<video\s+src="([^"]*)">(.*?)</video>', re.DOTALL)


def _parse_video_caption(caption: str) -> dict[str, str]:
    """Parse video caption into key-value params using the same syntax as images."""
    return parse_image_caption(caption)


def _extract_youtube_start(url: str) -> str | None:
    """Extract start time (t param) from a YouTube URL."""
    from urllib.parse import urlparse, parse_qs
    parsed = urlparse(url)
    params = parse_qs(parsed.query)
    t = params.get("t", [None])[0]
    return t


def _build_youtube_include(video_id: str, params: dict[str, str]) -> str:
    """Build {% include youtube.html id="..." %} with optional params."""
    parts = [f'id="{video_id}"']
    for key in ("start", "width", "height", "allowfullscreen"):
        if key in params:
            parts.append(f'{key}={_quote_param(params[key])}')
    # Any extra params
    for key, value in params.items():
        if key not in ("start", "width", "height", "allowfullscreen"):
            parts.append(f'{key}={_quote_param(value)}')
    return '{%% include youtube.html %s %%}' % " ".join(parts)


def _build_video_include(src: str, params: dict[str, str]) -> str:
    """Build {% include video.html src="..." %} with optional params."""
    parts = [f'src="{src}"']
    for key in ("width", "height", "controls"):
        if key in params:
            parts.append(f'{key}={_quote_param(params[key])}')
    for key, value in params.items():
        if key not in ("width", "height", "controls"):
            parts.append(f'{key}={_quote_param(value)}')
    return '{%% include video.html %s %%}' % " ".join(parts)


def _transform_html_tables(markdown: str) -> str:
    """Convert Notion HTML tables to markdown pipe tables."""
    # Only match Notion-generated tables (have header-row attribute)
    table_pattern = re.compile(
        r'<table\s+header-row="true">\s*(.*?)\s*</table>',
        re.DOTALL,
    )

    def convert_table(match: re.Match) -> str:
        body = match.group(1)
        rows = re.findall(r'<tr>\s*(.*?)\s*</tr>', body, re.DOTALL)
        if not rows:
            return match.group(0)

        table_rows = []
        for row in rows:
            cells = re.findall(r'<td>(.*?)</td>', row, re.DOTALL)
            cells = [c.strip() for c in cells]
            table_rows.append('| ' + ' | '.join(cells) + ' |')

        if len(table_rows) < 2:
            return match.group(0)

        # insert separator after header row
        num_cols = len(re.findall(r'<td>', rows[0]))
        separator = '| ' + ' | '.join(['--'] * num_cols) + ' |'
        result = [table_rows[0], separator] + table_rows[1:]
        return '\n'.join(result)

    return table_pattern.sub(convert_table, markdown)


def _transform_videos(markdown: str) -> str:
    """Convert <video> tags to YouTube includes or HTML5 video elements."""

    def replace_video(match: re.Match) -> str:
        src = match.group(1)
        caption = match.group(2).strip()
        params = _parse_video_caption(caption)

        # YouTube URL → include
        yt_match = _YOUTUBE_ID_RE.search(src)
        if yt_match:
            start = _extract_youtube_start(src)
            if start and "start" not in params:
                params["start"] = start
            return _build_youtube_include(yt_match.group(1), params)

        # Local/resolved video file → video include
        if src.startswith("/"):
            return _build_video_include(src, params)

        # Unresolved — leave as-is
        return match.group(0)

    return _VIDEO_TAG_RE.sub(replace_video, markdown)


_COLUMN_COUNT_WORDS = {1: "one", 2: "two", 3: "three", 4: "four"}


def _transform_columns(text: str) -> str:
    """Convert Notion <columns> XML to div.columns HTML layout."""
    import markdown as md

    def replace_columns(match: re.Match) -> str:
        inner = match.group(1)
        # Extract each <column> content
        columns = re.findall(
            r'<column>\s*(.*?)\s*</column>',
            inner,
            flags=re.DOTALL,
        )
        count_word = _COLUMN_COUNT_WORDS.get(len(columns), str(len(columns)))
        parts = [f'<div class="columns {count_word}">']
        for col in columns:
            # Strip leading tabs from Notion's column indentation
            lines = col.strip().splitlines()
            lines = [line.lstrip('\t') for line in lines]
            content = '\n'.join(lines)
            # If column has markdown (not figure includes or raw HTML),
            # render it to HTML so it works inside HTML divs.
            # Ignore inline <span> tags from the span marker transform —
            # they're inline elements that md.markdown() passes through fine.
            content_for_check = re.sub(r'</?span[^>]*>', '', content)
            is_markdown = '{%' not in content_for_check and '<' not in content_for_check
            if is_markdown:
                content = md.markdown(content)
            parts.append(f'    <div class="column">')
            for line in content.splitlines():
                parts.append(f'        {line}' if line.strip() else '')
            parts.append(f'    </div>')
        parts.append('</div>')
        return '\n'.join(parts)

    return re.sub(
        r'<columns>\s*(.*?)\s*</columns>',
        replace_columns,
        text,
        flags=re.DOTALL,
    )


# Callout emoji → transform handler mapping
_CALLOUT_TRANSFORMS = {
    "🔍": "methodology",
}


def _transform_callouts(markdown: str) -> str:
    """Convert Notion callout blocks with known emojis to Jekyll HTML."""

    def replace_callout(match: re.Match) -> str:
        icon = match.group(1)
        content = match.group(2).strip()

        handler = _CALLOUT_TRANSFORMS.get(icon)
        if not handler:
            # Unknown callout — leave as-is (will render as plain text)
            return match.group(0)

        if handler == "methodology":
            return _build_methodology(content)

        return match.group(0)

    return re.sub(
        r'<callout\s+icon="([^"]*)"[^>]*>\s*(.*?)\s*</callout>',
        replace_callout,
        markdown,
        flags=re.DOTALL,
    )


def _build_methodology(content: str) -> str:
    """Build methodology section using Jekyll capture/include pattern."""
    # Convert <br><br> to double newlines for paragraph separation
    content = re.sub(r'<br>\s*<br>', '\n\n', content)
    content = content.strip()
    return f"""{{% capture methodology-note %}}
{content}
{{% endcapture %}}
{{% include methodology-note.html content=methodology-note %}}"""


_NOTION_INLINE_EQ_RE = re.compile(r'\$`([^`]+)`\$')


def _transform_equations(markdown: str) -> tuple[str, bool]:
    r"""Convert Notion inline equations $`...`$ → \\(...\\) for MathJax.

    Double-escaped so kramdown passes \(...\) through to the HTML output.
    """
    result, count = _NOTION_INLINE_EQ_RE.subn(r'\\\\(\1\\\\)', markdown)
    return result, count > 0


_LIST_ITEM_RE = re.compile(r'^[ \t]*[-*+] |^[ \t]*\d+\. ')


def _add_block_spacing(markdown: str) -> str:
    """Add blank lines between blocks, but leave code block interiors untouched.

    Consecutive list items (at any depth) stay single-spaced to avoid kramdown
    rendering them as "loose" lists with <p> tags.
    """
    parts = markdown.split('```')
    for i in range(0, len(parts), 2):
        lines = parts[i].split('\n')
        result = [lines[0]] if lines else []
        for j in range(1, len(lines)):
            prev_is_list = bool(_LIST_ITEM_RE.match(lines[j - 1]))
            curr_is_list = bool(_LIST_ITEM_RE.match(lines[j]))
            # Keep single newline between consecutive list items
            if prev_is_list and curr_is_list:
                result.append(lines[j])
            # Don't double already-blank lines
            elif lines[j] == '' or lines[j - 1] == '':
                result.append(lines[j])
            else:
                result.append('')
                result.append(lines[j])
        parts[i] = '\n'.join(result)
        parts[i] = re.sub(r'\n{3,}', '\n\n', parts[i])
    # Ensure blank lines around code fences
    rejoined = '```'.join(parts)
    # Add blank line before opening fence (has language tag or is bare opening)
    rejoined = re.sub(r'([^\n])\n(```\w)', r'\1\n\n\2', rejoined)
    # Add blank line after closing fence (bare ``` followed by non-fence text)
    rejoined = re.sub(r'(```)\n([^\n`])', r'\1\n\n\2', rejoined)
    return rejoined
