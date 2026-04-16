"""Tests for the block transform pipeline.

Each test covers a specific transform or combination, using the same
input patterns we've seen from Notion's markdown API.
"""

import sys
from pathlib import Path

import pytest

# Add parent dir to path so we can import transforms directly
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from transforms import (
    apply_transforms,
    build_figure_include,
    parse_image_caption,
    _add_block_spacing,
    _transform_columns,
    _transform_callouts,
    _transform_equations,
    _build_methodology,
)


# ---------------------------------------------------------------------------
# parse_image_caption
# ---------------------------------------------------------------------------


class TestParseImageCaption:
    def test_empty(self):
        assert parse_image_caption("") == {}

    def test_plain_text(self):
        assert parse_image_caption("A photo of a cat") == {"alt": "A photo of a cat"}

    def test_key_value_pairs(self):
        result = parse_image_caption("alt: description | caption: Source")
        assert result == {"alt": "description", "caption": "Source"}

    def test_boolean_flag(self):
        result = parse_image_caption("alt: photo | autolink")
        assert result == {"alt": "photo", "autolink": "true"}

    def test_escaped_pipes(self):
        result = parse_image_caption("alt: photo \\| caption: Source")
        assert result == {"alt": "photo", "caption": "Source"}

    def test_link_with_url(self):
        result = parse_image_caption("link: /some/path | width: 600")
        assert result == {"link": "/some/path", "width": "600"}

    def test_markdown_link_in_value(self):
        """Notion wraps URLs as markdown links in captions — should extract URL."""
        result = parse_image_caption(
            "link: [https://example.com](https://example.com) | width: 600"
        )
        assert result == {"link": "https://example.com", "width": "600"}

    def test_complex_caption(self):
        result = parse_image_caption(
            "alt: A map of districts \\| caption: Texas' 35th district \\| link: /path \\| autolink \\| width: 500"
        )
        assert result == {
            "alt": "A map of districts",
            "caption": "Texas' 35th district",
            "link": "/path",
            "autolink": "true",
            "width": "500",
        }


# ---------------------------------------------------------------------------
# build_figure_include
# ---------------------------------------------------------------------------


class TestBuildFigureInclude:
    def test_src_only(self):
        result = build_figure_include("/img/photo.png", {})
        assert result == '{% include figure.html src="/img/photo.png" %}'

    def test_with_params(self):
        result = build_figure_include(
            "/img/photo.png", {"alt": "A photo", "width": "600"}
        )
        assert result == '{% include figure.html src="/img/photo.png" alt="A photo" width="600" %}'

    def test_param_order(self):
        """Params should follow the defined order: alt, caption, link, autolink, width, style."""
        result = build_figure_include(
            "/img/photo.png",
            {"width": "600", "alt": "desc", "link": "/path", "caption": "Source"},
        )
        assert 'alt="desc"' in result
        assert result.index("alt=") < result.index("caption=")
        assert result.index("caption=") < result.index("link=")
        assert result.index("link=") < result.index("width=")

    def test_single_quotes_for_double_quote_values(self):
        result = build_figure_include(
            "/img/photo.png", {"caption": 'He said "hello"'}
        )
        assert "caption='He said \"hello\"'" in result


# ---------------------------------------------------------------------------
# Divider transform
# ---------------------------------------------------------------------------


class TestDividerTransform:
    def test_basic_divider(self):
        result, _, _ = apply_transforms("Hello\n\n---\n\nWorld")
        assert "{% include section-break.html %}" in result
        assert "---" not in result

    def test_divider_with_whitespace(self):
        result, _, _ = apply_transforms("Hello\n\n---  \n\nWorld")
        assert "{% include section-break.html %}" in result

    def test_divider_not_in_text(self):
        """--- in the middle of text should not be replaced."""
        result, _, _ = apply_transforms("some---thing")
        assert "section-break" not in result


# ---------------------------------------------------------------------------
# Image transform
# ---------------------------------------------------------------------------


class TestImageTransform:
    def test_basic_image(self):
        result, _, _ = apply_transforms("![alt text](/img/photo.png)")
        assert '{% include figure.html src="/img/photo.png" alt="alt text" %}' in result

    def test_image_with_caption_metadata(self):
        result, _, _ = apply_transforms(
            "![alt: A photo \\| caption: Source \\| width: 600](/img/photo.png)"
        )
        assert 'src="/img/photo.png"' in result
        assert 'alt="A photo"' in result
        assert 'caption="Source"' in result
        assert 'width="600"' in result

    def test_image_with_nested_brackets(self):
        """Image with markdown link in caption (Notion exports link: [url](url))."""
        md = '![link: [https://example.com](https://example.com) \\| width: 600](/img/photo.png)'
        result, _, _ = apply_transforms(md)
        assert 'src="/img/photo.png"' in result
        assert 'link="https://example.com"' in result
        assert 'width="600"' in result

    def test_inline_image_not_on_own_line(self):
        """Images must be on their own line to be transformed."""
        result, _, _ = apply_transforms("text ![alt](/img.png) more text")
        assert "figure.html" not in result


# ---------------------------------------------------------------------------
# Block spacing
# ---------------------------------------------------------------------------


class TestBlockSpacing:
    def test_adds_blank_lines(self):
        result = _add_block_spacing("Line 1\nLine 2\nLine 3")
        assert result == "Line 1\n\nLine 2\n\nLine 3"

    def test_preserves_existing_blank_lines(self):
        result = _add_block_spacing("Line 1\n\nLine 2")
        assert result == "Line 1\n\nLine 2"

    def test_collapses_triple_newlines(self):
        result = _add_block_spacing("Line 1\n\n\n\nLine 2")
        assert result == "Line 1\n\nLine 2"

    def test_list_items_stay_tight(self):
        result = _add_block_spacing("- Item 1\n- Item 2\n- Item 3")
        assert result == "- Item 1\n- Item 2\n- Item 3"

    def test_nested_list_items_stay_tight(self):
        result = _add_block_spacing("- Item 1\n\t- Sub item\n- Item 2")
        assert result == "- Item 1\n\t- Sub item\n- Item 2"

    def test_paragraph_before_list_gets_spacing(self):
        result = _add_block_spacing("Some text\n- Item 1\n- Item 2")
        assert result == "Some text\n\n- Item 1\n- Item 2"

    def test_code_block_interior_preserved(self):
        md = "text\n```python\nline1\nline2\n```\nmore"
        result = _add_block_spacing(md)
        # Interior of code block should NOT get doubled
        assert "line1\nline2" in result

    def test_ordered_list_stays_tight(self):
        result = _add_block_spacing("1. First\n2. Second\n3. Third")
        assert result == "1. First\n2. Second\n3. Third"


# ---------------------------------------------------------------------------
# Raw code blocks
# ---------------------------------------------------------------------------


class TestRawCodeBlocks:
    def test_strip_raw_fences(self):
        md = "before\n```raw\n<div>hello</div>\n```\nafter"
        result, _, _ = apply_transforms(md)
        assert "```" not in result
        assert "<div>hello</div>" in result

    def test_strip_plain_text_fences(self):
        md = "before\n```plain text\n{% include something.html %}\n```\nafter"
        result, _, _ = apply_transforms(md)
        assert "```" not in result
        assert "{% include something.html %}" in result

    def test_preserves_blank_line_before(self):
        md = "Some paragraph\n```raw\n<div>hello</div>\n```"
        result, _, _ = apply_transforms(md)
        lines = result.strip().splitlines()
        # Find the div line and check there's a blank line before it
        div_idx = next(i for i, l in enumerate(lines) if "<div>" in l)
        assert lines[div_idx - 1] == "", "Should have blank line before raw content"


# ---------------------------------------------------------------------------
# Equations
# ---------------------------------------------------------------------------


class TestEquations:
    def test_inline_equation_converted(self):
        md = r"Here is an equation: $`x = y_0 + y_1`$"
        result, has_eq = _transform_equations(md)
        assert result == "Here is an equation: \\\\(x = y_0 + y_1\\\\)"
        assert has_eq is True

    def test_no_equations(self):
        md = "No math here, just $5 dollars"
        result, has_eq = _transform_equations(md)
        assert result == md
        assert has_eq is False

    def test_multiple_equations(self):
        md = r"Where $`x`$ is the number and $`p_0`$ is the base"
        result, has_eq = _transform_equations(md)
        assert result == "Where \\\\(x\\\\) is the number and \\\\(p_0\\\\) is the base"
        assert has_eq is True

    def test_mathjax_flag_in_pipeline(self):
        md = r"Here is $`x = 1`$ inline"
        result, _, flags = apply_transforms(md)
        assert flags.get("mathjax") is True
        assert "\\\\(x = 1\\\\)" in result

    def test_no_mathjax_flag_without_equations(self):
        md = "Just plain text"
        _, _, flags = apply_transforms(md)
        assert "mathjax" not in flags


# ---------------------------------------------------------------------------
# Columns
# ---------------------------------------------------------------------------


class TestColumns:
    def test_two_columns(self):
        md = "<columns><column>Col 1</column><column>Col 2</column></columns>"
        result = _transform_columns(md)
        assert '<div class="columns two">' in result
        assert '<div class="column">' in result
        assert "Col 1" in result
        assert "Col 2" in result

    def test_three_columns(self):
        md = "<columns><column>A</column><column>B</column><column>C</column></columns>"
        result = _transform_columns(md)
        assert '<div class="columns three">' in result

    def test_markdown_column_rendered_to_html(self):
        """Markdown content in columns should be rendered to HTML."""
        md = "<columns><column>A paragraph with a [link](https://example.com).</column><column>{% include figure.html src=\"/img.png\" %}</column></columns>"
        result = _transform_columns(md)
        # Markdown column should have <p> and <a> tags
        assert "<p>" in result
        assert '<a href="https://example.com">' in result
        # Figure column should NOT have markdown="1"
        assert 'markdown="1"' not in result

    def test_html_column_not_rendered(self):
        """Columns with HTML/Liquid should be left as-is."""
        md = "<columns><column>{% include tweet.html url=\"x\" %}</column><column>{% include tweet.html url=\"y\" %}</column></columns>"
        result = _transform_columns(md)
        assert "{% include tweet.html" in result
        assert "<p>" not in result

    def test_tab_stripping(self):
        md = "<columns><column>\t\tIndented content</column></columns>"
        result = _transform_columns(md)
        assert "Indented content" in result
        assert "\t\tIndented" not in result


# ---------------------------------------------------------------------------
# Callouts
# ---------------------------------------------------------------------------


class TestCallouts:
    def test_methodology_callout(self):
        md = '<callout icon="🔍" color="default">Some methodology text</callout>'
        result = _transform_callouts(md)
        assert "{% capture methodology-note %}" in result
        assert "Some methodology text" in result
        assert "{% include methodology-note.html content=methodology-note %}" in result

    def test_unknown_callout_passthrough(self):
        md = '<callout icon="💡" color="default">A tip</callout>'
        result = _transform_callouts(md)
        assert result == md

    def test_methodology_br_conversion(self):
        content = "Paragraph one<br><br>Paragraph two"
        result = _build_methodology(content)
        assert "Paragraph one\n\nParagraph two" in result


# ---------------------------------------------------------------------------
# Italic/bold fragment merging
# ---------------------------------------------------------------------------


class TestItalicBoldMerging:
    def test_italic_link_fragment(self):
        md = "*Update: see *[*this thread*](https://example.com)* for details.*"
        result, _, _ = apply_transforms(md)
        assert "*Update: see [this thread](https://example.com) for details.*" in result

    def test_bold_link_fragment(self):
        md = "**see **[**this**](https://example.com)** thing**"
        result, _, _ = apply_transforms(md)
        assert "[this](https://example.com)" in result

    def test_multiple_fragmented_links(self):
        md = "*see *[*link1*](url1)* and *[*link2*](url2)* here*"
        result, _, _ = apply_transforms(md)
        assert "[link1](url1)" in result
        assert "[link2](url2)" in result

    def test_normal_italic_untouched(self):
        md = "*this is italic text*"
        result, _, _ = apply_transforms(md)
        assert "*this is italic text*" in result

    def test_normal_link_untouched(self):
        md = "see [this link](https://example.com) for details"
        result, _, _ = apply_transforms(md)
        assert "[this link](https://example.com)" in result


# ---------------------------------------------------------------------------
# Notion page link resolution
# ---------------------------------------------------------------------------


class TestNotionPageLinks:
    def test_resolve_db_link(self):
        stem_map = {"abc123def456abc123def456abc123de": "2022-09-27-howdy-update"}
        md = "[previously mentioned](/abc123def456abc123def456abc123de?pvs=25)"
        result, unknowns, _ = apply_transforms(md, post_stem_by_page_id=stem_map)
        assert "{% post_url 2022-09-27-howdy-update %}" in result
        assert not unknowns

    def test_unresolved_link_flagged(self):
        md = "[some page](/abc123def456abc123def456abc123de?pvs=25)"
        result, unknowns, _ = apply_transforms(md, post_stem_by_page_id={})
        # Link should be left as-is
        assert "/abc123def456abc123def456abc123de?pvs=25" in result
        assert any("unresolved Notion page links" in u for u in unknowns)

    def test_normal_links_untouched(self):
        md = "[example](https://example.com)"
        result, unknowns, _ = apply_transforms(md)
        assert "[example](https://example.com)" in result
        assert not unknowns


# ---------------------------------------------------------------------------
# Inline span markers
# ---------------------------------------------------------------------------


class TestSpanMarkers:
    def test_id_and_class(self):
        md = "text `{{span#footnote-1.footnote}}`linked content`{{/span}}` more text"
        result, _, _ = apply_transforms(md)
        assert '<span id="footnote-1" class="footnote">linked content</span>' in result

    def test_id_only(self):
        md = "text `{{span#my-id}}`some text`{{/span}}` more"
        result, _, _ = apply_transforms(md)
        assert '<span id="my-id">some text</span>' in result

    def test_class_only(self):
        md = "`{{span.highlight}}`highlighted`{{/span}}`"
        result, _, _ = apply_transforms(md)
        assert '<span class="highlight">highlighted</span>' in result

    def test_multiple_classes(self):
        md = "`{{span.cls-one.cls-two}}`text`{{/span}}`"
        result, _, _ = apply_transforms(md)
        assert '<span class="cls-one cls-two">text</span>' in result

    def test_id_and_multiple_classes(self):
        md = "`{{span#note-1.footnote.tooltip}}`content`{{/span}}`"
        result, _, _ = apply_transforms(md)
        assert '<span id="note-1" class="footnote tooltip">content</span>' in result

    def test_with_link_content(self):
        md = "text `{{span#footnote-1.footnote}}`[100 scenarios](https://example.com)`{{/span}}` more"
        result, _, _ = apply_transforms(md)
        assert '<span id="footnote-1" class="footnote">[100 scenarios](https://example.com)</span>' in result

    def test_multiple_spans(self):
        md = "`{{span#fn-1.footnote}}`first`{{/span}}` and `{{span#fn-2.footnote}}`second`{{/span}}`"
        result, _, _ = apply_transforms(md)
        assert 'id="fn-1"' in result
        assert 'id="fn-2"' in result

    def test_no_attrs(self):
        md = "`{{span}}`bare span`{{/span}}`"
        result, _, _ = apply_transforms(md)
        assert '<span>bare span</span>' in result


# ---------------------------------------------------------------------------
# URL localization
# ---------------------------------------------------------------------------


class TestUrlLocalization:
    def test_markdown_link(self):
        md = "[text](https://ben-tanen.com/some/path)"
        result, _, _ = apply_transforms(md, site_url="https://ben-tanen.com")
        assert "](/some/path)" in result

    def test_href_attribute(self):
        md = '<a href="https://ben-tanen.com/page">link</a>'
        result, _, _ = apply_transforms(md, site_url="https://ben-tanen.com")
        assert 'href="/page"' in result

    def test_external_url_untouched(self):
        md = "[text](https://example.com/path)"
        result, _, _ = apply_transforms(md, site_url="https://ben-tanen.com")
        assert "https://example.com/path" in result


# ---------------------------------------------------------------------------
# Video transforms
# ---------------------------------------------------------------------------


class TestVideoTransform:
    def test_youtube_standard_url(self):
        md = '<video src="https://www.youtube.com/watch?v=dQw4w9WgXcQ"></video>'
        result, _, _ = apply_transforms(md)
        assert '{% include youtube.html id="dQw4w9WgXcQ" %}' in result

    def test_youtube_short_url(self):
        md = '<video src="https://youtu.be/dQw4w9WgXcQ"></video>'
        result, _, _ = apply_transforms(md)
        assert '{% include youtube.html id="dQw4w9WgXcQ" %}' in result

    def test_youtube_with_tracking_params(self):
        md = '<video src="https://youtu.be/dQw4w9WgXcQ?si=abc123"></video>'
        result, _, _ = apply_transforms(md)
        assert '{% include youtube.html id="dQw4w9WgXcQ" %}' in result

    def test_youtube_with_start_time(self):
        md = '<video src="https://youtu.be/dQw4w9WgXcQ?si=abc123&t=201"></video>'
        result, _, _ = apply_transforms(md)
        assert 'id="dQw4w9WgXcQ"' in result
        assert 'start="201"' in result

    def test_youtube_start_time_standard_url(self):
        md = '<video src="https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=60"></video>'
        result, _, _ = apply_transforms(md)
        assert 'id="dQw4w9WgXcQ"' in result
        assert 'start="60"' in result

    def test_youtube_with_caption_params(self):
        md = '<video src="https://youtu.be/dQw4w9WgXcQ">width: 400 | height: 225</video>'
        result, _, _ = apply_transforms(md)
        assert 'id="dQw4w9WgXcQ"' in result
        assert 'width="400"' in result
        assert 'height="225"' in result

    def test_youtube_allowfullscreen_param(self):
        md = '<video src="https://youtu.be/dQw4w9WgXcQ">width: 400 | allowfullscreen</video>'
        result, _, _ = apply_transforms(md)
        assert 'allowfullscreen="true"' in result
        assert 'width="400"' in result

    def test_local_video(self):
        md = '<video src="/assets/video/posts/my-video-abc123.mov"></video>'
        result, _, _ = apply_transforms(md)
        assert '{% include video.html src="/assets/video/posts/my-video-abc123.mov" %}' in result

    def test_local_video_with_dimensions(self):
        md = '<video src="/assets/video/posts/my-video.mp4">width: 640 | height: 360</video>'
        result, _, _ = apply_transforms(md)
        assert 'video.html' in result
        assert 'src="/assets/video/posts/my-video.mp4"' in result
        assert 'width="640"' in result
        assert 'height="360"' in result

    def test_unresolved_file_url_passthrough(self):
        """file:// URLs that weren't resolved by sync should pass through."""
        md = '<video src="file://%7B%22source%22%3A%22attachment%22%7D"></video>'
        result, _, _ = apply_transforms(md)
        assert '<video src="file://' in result


# ---------------------------------------------------------------------------
# Unknown/empty block stripping
# ---------------------------------------------------------------------------


class TestBlockStripping:
    def test_unknown_tags_stripped(self):
        md = 'before\n<unknown url="x" alt="widget"/>\nafter'
        result, unknowns, _ = apply_transforms(md)
        assert "<unknown" not in result
        assert any("unsupported embed: widget" in u for u in unknowns)

    def test_empty_blocks_stripped(self):
        md = "before\n<empty-block/>\nafter"
        result, _, _ = apply_transforms(md)
        assert "<empty-block" not in result


# ---------------------------------------------------------------------------
# Full pipeline integration
# ---------------------------------------------------------------------------


class TestFullPipeline:
    def test_divider_and_spacing(self):
        md = "Paragraph one\n---\nParagraph two"
        result, _, _ = apply_transforms(md)
        assert "{% include section-break.html %}" in result
        # Paragraphs should have spacing
        assert "\n\n" in result

    def test_image_and_raw_block(self):
        md = "![alt: photo](/img.png)\n```raw\n<script>alert(1)</script>\n```"
        result, _, _ = apply_transforms(md)
        assert "figure.html" in result
        assert "<script>alert(1)</script>" in result
        assert "```" not in result
