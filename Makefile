# --------------------------------------------------------------------------
# Notion Bridge
# --------------------------------------------------------------------------

NOTION_CMD = op run --env-file=_env/.env -- uv run --project _env/notion_bridge python3
SYNC_SCRIPT = _env/notion_bridge/cli.py

# Sync Notion → Jekyll
#   make sync                          sync all changed pages
#   make sync SLUG=howdy-update        sync a single post/project
#   make sync FORCE=1                  sync all pages regardless of last edit time
#   make sync DRY=1                    preview without writing files
#   make sync SLUG=howdy-update FORCE=1 DRY=1
sync:
	$(NOTION_CMD) $(SYNC_SCRIPT) \
		$(if $(SLUG),--slug $(SLUG)) \
		$(if $(FORCE),--force) \
		$(if $(DRY),--dry-run)

# --------------------------------------------------------------------------
# Tests
# --------------------------------------------------------------------------

TEST_DIR = _env/notion_bridge/tests
TEST_CMD = uv run --project _env/notion_bridge pytest

# Run tests
#   make test                          run transform tests only (fast, no API)
#   make test ALL=1                    run all tests including API snapshot
#   make test UPDATE=1                 update the API snapshot fixture
#   make test K=TestColumns            run tests matching a pattern
test:
ifdef ALL
	op run --env-file=_env/.env -- $(TEST_CMD) $(TEST_DIR) -v $(if $(K),-k $(K)) $(if $(UPDATE),--update-snapshot)
else ifdef UPDATE
	op run --env-file=_env/.env -- $(TEST_CMD) $(TEST_DIR) -v --update-snapshot $(if $(K),-k $(K))
else
	$(TEST_CMD) $(TEST_DIR)/test_transforms.py -v $(if $(K),-k $(K))
endif

# --------------------------------------------------------------------------
# Local dev server
# --------------------------------------------------------------------------

# Serve the site locally
#   make run                           serve with watch + livereload (default)
#   make run DRAFTS=1                  include _drafts/ posts
#   make run NOWATCH=1                 disable watch and livereload
run:
	op run --env-file=_env/.env -- jekyll serve \
		$(if $(NOWATCH),,-w --livereload) \
		$(if $(DRAFTS),--drafts)

.PHONY: sync test run
