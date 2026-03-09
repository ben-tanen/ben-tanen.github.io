## Ben Tanen Personal Page
#### Built Using Jekyll

This is my personal website. It includes a collection of my work from over the years.

### Local dev

```bash
# install dependencies (first time only)
bundle install

# serve with secrets injected from 1Password
op run --env-file=.env -- jekyll serve
```

The `_plugins/inject_secrets.rb` plugin replaces `__SECRET_NAME__` placeholders in built files with matching environment variables. The `.env` file uses `op://` references so secrets are resolved at runtime via 1Password.

### Adding a new secret

1. Store the secret in 1Password
2. Add the `op://` reference to `.env`
3. Add the secret to GitHub: `gh secret set <NAME> --body "value"`
4. Add to `.github/workflows/jekyll-gh-pages.yml`: the `env:` block and the `for` loop
5. Use `__NAME__` as the placeholder in code

