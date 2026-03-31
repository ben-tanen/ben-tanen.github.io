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
            params[key.strip()] = value.strip()
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
# Main transform pipeline
# ---------------------------------------------------------------------------


def apply_transforms(markdown: str) -> tuple[str, list[str]]:
    """Apply all block transforms to markdown content.

    Returns (transformed_markdown, list_of_unknown_block_descriptions).
    """
    transforms = load_block_transforms()
    unknowns = []

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
    img_pattern = re.compile(r'^[ \t]*!\[([^\]]*)\]\(([^)]+)\)\s*$', re.MULTILINE)

    def transform_image(match: re.Match) -> str:
        alt_text = match.group(1)
        src = match.group(2)
        params = parse_image_caption(alt_text)
        return build_figure_include(src, params)

    markdown = img_pattern.sub(transform_image, markdown)

    # Transform 3: raw code blocks → inline content (strip fences)
    # Allows leading whitespace (tabs/spaces) for fences inside columns.
    # Runs before block spacing and columns so content is unwrapped first.
    markdown = re.sub(
        r'^[ \t]*```(?:raw|plain text|plaintext|text)\n(.*?)[ \t]*```',
        lambda m: m.group(1).rstrip('\n'),
        markdown,
        flags=re.MULTILINE | re.DOTALL,
    )

    # Transform 4: columns → div.columns layout
    # Runs after raw transform so column contents are already unwrapped.
    markdown = _transform_columns(markdown)

    # Normalize block spacing: ensure blank lines between blocks.
    # Notion's markdown API uses single \n between blocks, but Jekyll/kramdown
    # needs \n\n to treat them as separate block-level elements.
    # Process only outside of fenced code blocks to preserve their formatting.
    markdown = _add_block_spacing(markdown)

    # Strip <unknown> tags (Notion embed blocks the API can't convert)
    unknown_tags = re.findall(r'<unknown\s[^>]*alt="([^"]*)"[^>]*/>', markdown)
    if unknown_tags:
        unknowns.extend(f"unsupported embed: {alt}" for alt in unknown_tags)
    markdown = re.sub(r'<unknown\s[^>]*/>\n?', '', markdown)

    # Strip <empty-block/> tags
    markdown = re.sub(r'<empty-block/>\n?', '', markdown)

    return markdown, unknowns


_COLUMN_COUNT_WORDS = {1: "one", 2: "two", 3: "three", 4: "four"}


def _transform_columns(markdown: str) -> str:
    """Convert Notion <columns> XML to div.columns HTML layout."""

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
            parts.append(f'    <div class="column">')
            for line in content.splitlines():
                parts.append(f'        {line}' if line.strip() else '')
            parts.append(f'    </div>')
        parts.append('</div>')
        return '\n'.join(parts)

    return re.sub(
        r'<columns>\s*(.*?)\s*</columns>',
        replace_columns,
        markdown,
        flags=re.DOTALL,
    )


def _add_block_spacing(markdown: str) -> str:
    """Add blank lines between blocks, but leave code block interiors untouched."""
    parts = markdown.split('```')
    for i in range(0, len(parts), 2):
        # Even-indexed parts are outside code fences — normalize spacing
        parts[i] = re.sub(r'\n(?!\n)', '\n\n', parts[i])
        parts[i] = re.sub(r'\n{3,}', '\n\n', parts[i])
    return '```'.join(parts)
