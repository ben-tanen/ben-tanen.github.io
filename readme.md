## Ben Tanen Personal Page

### Built Using Jekyll

This is my personal website. It includes a collection of my work from over the years.

### Local dev

```bash
# install dependencies (first time only)
bundle install

# serve locally with watch + livereload
make run
make run DRAFTS=1          # include _drafts/ posts
make run NOWATCH=1         # disable watch and livereload
```

### Notion CMS sync

```bash
make sync                          # sync all changed pages
make sync SLUG=howdy-update        # sync a single post/project
make sync FORCE=1                  # sync all pages regardless of last edit time
make sync DRY=1                    # preview without writing files
```

### Tests

```bash
make test                          # run transform tests only (fast, no API)
make test ALL=1                    # run all tests including API snapshot
make test UPDATE=1                 # update the API snapshot fixture
make test K=TestColumns            # run tests matching a pattern
```

### Secrets

The `_plugins/inject_secrets.rb` plugin replaces `__SECRET_NAME__` placeholders in built files with matching environment variables. The `.env` file uses `op://` references so secrets are resolved at runtime via 1Password.

#### Adding a new secret

1. Store the secret in 1Password
2. Add the `op://` reference to `.env`
3. Add the secret to GitHub: `gh secret set <NAME> --body "value"`
4. Add to `.github/workflows/jekyll-gh-pages.yml`: the `env:` block and the `for` loop
5. Use `__NAME__` as the placeholder in code

