"""Snapshot tests for Notion markdown API output.

Fetches the test page from Notion and compares against a stored fixture.
Catches Notion API format changes that might require transform updates.

Requires NOTION_API_TOKEN environment variable (use `op run` to inject).

Run: op run --env-file=_env/.env -- uv run --project _env/notion_bridge pytest _env/notion_bridge/tests/test_api_snapshot.py -v
Update fixture: op run --env-file=_env/.env -- uv run --project _env/notion_bridge pytest _env/notion_bridge/tests/test_api_snapshot.py -v --update-snapshot
"""

import os
import re
import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

FIXTURE_DIR = Path(__file__).parent / "fixtures"
SNAPSHOT_PATH = FIXTURE_DIR / "notion_test_page_snapshot.md"
TEST_PAGE_ID = "3340ec74-530b-8046-a9e3-efce5d67c2a1"
SNAPSHOT_HEADER_RE = re.compile(r"^<!--\s*snapshot metadata\s*\n.*?-->\n", re.DOTALL)

# S3 pre-signed URL pattern — normalized to stable placeholders since URLs expire
S3_URL_PATTERN = re.compile(
    r"https://prod-files-secure\.s3\.us-west-2\.amazonaws\.com/[^/]+/([0-9a-f-]{36})/[^)\s]+"
)


def _normalize_s3_urls(content: str) -> str:
    """Replace S3 pre-signed URLs with stable placeholders keyed by attachment UUID."""
    seen: dict[str, int] = {}
    counter = 0

    def replace(match: re.Match) -> str:
        nonlocal counter
        attachment_id = match.group(1)
        if attachment_id not in seen:
            counter += 1
            seen[attachment_id] = counter
        return f"{{{{S3_IMAGE_{seen[attachment_id]}}}}}"

    return S3_URL_PATTERN.sub(replace, content)


def _fetch_test_page() -> str:
    """Fetch markdown from the Notion test page."""
    from config import load_config
    from sync import fetch_page_markdown

    config = load_config()
    token = os.environ["NOTION_API_TOKEN"]
    api_version = config["notion"]["api_version"]
    md = fetch_page_markdown(token, api_version, TEST_PAGE_ID)
    return md["markdown"]


@pytest.fixture
def update_snapshot(request):
    return request.config.getoption("--update-snapshot")


# ---------------------------------------------------------------------------
# Tests
# ---------------------------------------------------------------------------


@pytest.mark.skipif(
    not os.environ.get("NOTION_API_TOKEN"),
    reason="NOTION_API_TOKEN not set — run with op run",
)
class TestNotionAPISnapshot:
    def test_snapshot_matches(self, update_snapshot):
        """Compare current API output against stored fixture."""
        from datetime import date
        from config import load_config

        raw = _fetch_test_page()
        normalized = _normalize_s3_urls(raw)

        if update_snapshot:
            config = load_config()
            api_version = config["notion"]["api_version"]
            header = (
                f"<!-- snapshot metadata\n"
                f"  captured: {date.today().isoformat()}\n"
                f"  notion_api_version: {api_version}\n"
                f"  page_id: {TEST_PAGE_ID}\n"
                f"  notes: S3 image URLs normalized to {{{{S3_IMAGE_N}}}} placeholders\n"
                f"-->\n"
            )
            SNAPSHOT_PATH.write_text(header + normalized)
            pytest.skip("Snapshot updated — review the diff before committing")

        expected = SNAPSHOT_PATH.read_text()
        # Strip metadata header for comparison
        expected = SNAPSHOT_HEADER_RE.sub("", expected)
        if normalized != expected:
            # Show a useful diff
            import difflib

            diff = difflib.unified_diff(
                expected.splitlines(keepends=True),
                normalized.splitlines(keepends=True),
                fromfile="fixture (expected)",
                tofile="api output (actual)",
            )
            diff_text = "".join(diff)
            pytest.fail(
                f"Notion API output differs from snapshot.\n"
                f"Run with --update-snapshot to update.\n\n{diff_text}"
            )

    def test_headings_present(self):
        """Verify heading block types are exported correctly."""
        raw = _fetch_test_page()
        assert "# This is an H1" in raw
        assert "## This is an H2" in raw
        assert "### This is an H3" in raw
        assert "#### This is an H4" in raw

    def test_notion_page_link_format(self):
        """Verify Notion page links use the /hex-id?pvs= format."""
        raw = _fetch_test_page()
        # Non-DB page link
        assert re.search(r"\(/[0-9a-f]{32}\?pvs=\d+\)", raw)

    def test_italic_link_fragmentation(self):
        """Verify Notion still fragments italic markers around links."""
        raw = _fetch_test_page()
        # *where *[*the text*](url)* more*
        assert "*where *[*" in raw

    def test_footnote_markers_preserved(self):
        """Verify backtick-wrapped footnote markers pass through."""
        raw = _fetch_test_page()
        assert "`{{footnote-1}}`" in raw
        assert "`{{end-footnote}}`" in raw

    def test_columns_xml_format(self):
        """Verify columns use <columns>/<column> XML tags."""
        raw = _fetch_test_page()
        assert "<columns>" in raw
        assert "<column>" in raw
        assert "</column>" in raw
        assert "</columns>" in raw

    def test_callout_format(self):
        """Verify callouts use <callout icon=...> tags."""
        raw = _fetch_test_page()
        assert '<callout icon="🔍"' in raw
        assert '<callout icon="🎩"' in raw

    def test_unknown_embed_format(self):
        """Verify embeds use <unknown ... alt="tweet"/> tags."""
        raw = _fetch_test_page()
        assert 'alt="tweet"/>' in raw

    def test_plain_text_code_block_format(self):
        """Verify plain text code blocks use ```plain text fences."""
        raw = _fetch_test_page()
        assert "```plain text\n" in raw

    def test_divider_format(self):
        """Verify dividers are exported as ---."""
        raw = _fetch_test_page()
        assert re.search(r"^---\s*$", raw, re.MULTILINE)

    def test_image_caption_pipe_escaping(self):
        """Verify Notion escapes pipes in image captions as \\|."""
        raw = _fetch_test_page()
        assert "\\|" in raw

    def test_list_nesting_format(self):
        """Verify nested lists use tab indentation."""
        raw = _fetch_test_page()
        # Check for tab-indented sub-items (apostrophe may be curly or straight)
        assert re.search(r"\t- Here.s a sub bullet!", raw)
        assert re.search(r"\t1\. Here is a sub-bullet", raw)

    def test_empty_block_format(self):
        """Verify empty blocks use <empty-block/> tags."""
        raw = _fetch_test_page()
        assert "<empty-block/>" in raw

    def test_s3_image_urls(self):
        """Verify images use S3 pre-signed URLs."""
        raw = _fetch_test_page()
        assert "prod-files-secure.s3.us-west-2.amazonaws.com" in raw
