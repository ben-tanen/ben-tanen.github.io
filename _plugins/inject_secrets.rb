# Replaces __ENV_VAR_NAME__ placeholders in built files with matching
# environment variables. Works with `op run --env-file=.env -- jekyll serve`
# for local dev. In production, the GitHub Actions workflow handles injection.
Jekyll::Hooks.register :site, :post_write do |site|
  Dir.glob(File.join(site.dest, '**/*.{js,html,json}')) do |file|
    content = File.read(file)
    modified = content.gsub(/__([A-Z_]+)__/) { ENV[$1] || $& }
    File.write(file, modified) if content != modified
  end
end
