# MDX And Markdown Rendering

## Required Rendering

Blogr sends article bodies as MDX in `content_mdx`, with `content_markdown` as fallback. The target app should render:

- YAML frontmatter, stripped from visible content
- H1 through H6 headings
- paragraphs
- bold and italic
- links
- ordered and unordered lists
- blockquotes
- tables
- horizontal rules
- inline code
- fenced code blocks
- markdown images after URL rewriting
- whitelisted YouTube embeds

Sanitize rendered output. Do not allow arbitrary scripts, unsafe event handlers, or untrusted iframe sources.

## Headings And Table Of Contents

Render Blogr `#` lines as H1 headings, not literal text.

Add stable, URL-safe IDs to H1 through H6 headings so hash links work. Build a table of contents from H2 through H6 only. The article H1 should not appear in the table of contents.

Hash links should scroll smoothly to the matching section on client-side navigation and full page loads.

## YouTube Embeds

Support Blogr YouTube output:

- multiline raw iframe blocks
- older self-closing iframe variants
- standalone YouTube watch URLs
- markdown links to YouTube URLs
- `youtube.com/embed`
- `youtube-nocookie.com/embed`
- `youtu.be`

If the markdown or MDX renderer would show a Blogr YouTube iframe as raw text, add a safe transform or renderer for whitelisted YouTube iframe shapes.

Reject arbitrary iframe sources. Preserve only safe attributes needed for a YouTube player.

## Images

Render only rewritten target-owned image URLs or target-owned serving routes. Do not render Blogr source image URLs directly in public pages.
