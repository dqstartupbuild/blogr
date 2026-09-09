# Safe MDX And Markdown Rendering

## Trust Boundary

Treat `content_mdx`, `content_markdown`, `content_html`, and repo-exported article files as untrusted content. [Next.js documents MDX](https://nextjs.org/docs/app/guides/mdx) as Markdown that can include JSX and be compiled into application code. Because Blogr content is remote input, do not put it through that executable path.

Do not compile or evaluate received MDX as JavaScript. Reject or neutralize:

- `import` and `export`
- JSX expressions such as `{...}`
- arbitrary JSX components
- scripts, event handlers, dangerous URLs, and unapproved raw HTML
- iframe sources other than the exact supported YouTube forms

Use a Markdown parser with an explicit component map, such as [react-markdown](https://github.com/remarkjs/react-markdown), and sanitize any approved HTML through a narrow schema such as [rehype-sanitize](https://github.com/rehypejs/rehype-sanitize). If raw HTML is not required, keep it disabled. `content_html` is compatibility data, never an unsafe shortcut.

Repo export does not launder input into trusted build-time MDX. Serialize the supported content subset as data, and render it through the same controlled pipeline. Do not import an exported article as an executable MDX module.

## Supported Content

Support the subset Blogr produces:

- YAML frontmatter parsed as data and omitted from visible content
- H1 through H6, paragraphs, emphasis, links, lists, blockquotes, and horizontal rules
- tables, inline code, fenced code blocks, and rewritten Markdown images
- controlled YouTube embeds

Apply safe URL policies to links and images. Render images only from the target's stable serving origin/path or explicitly configured permanent image origin.

## Headings And Table Of Contents

Generate deterministic, collision-safe, URL-safe IDs for H1 through H6. Render `#` lines as real H1 headings. Build the table of contents from H2 through H6 only.

Support Blogr's trailing `{#custom-id}` heading syntax as inert data, removing it from visible labels and validating the ID. Use one parsed heading model for rendered IDs and the TOC, with collision handling shared across explicit and generated IDs. Ignore heading-like text inside code fences. Preserve meaningful Unicode labels and direct fragment links.

When the page already renders the article title, remove only a matching leading body H1. If the page supplies a TOC, remove only a recognized redundant body TOC made of local section links; do not delete arbitrary sections named similarly or distinct body headings. Parse title/TOC normalization outside code fences.

Preserve Markdown immediately following an allowed iframe/video block, including when the source omitted a blank line. Normalize supported embeds through the controlled pipeline without enabling executable MDX. Test the rendered DOM, not just independent heading helper output.

Do not derive heading IDs from unsafe raw HTML. Verify duplicate headings, punctuation-only headings, Unicode, client navigation, and direct hash loads.

## YouTube Validation

Parse candidate URLs with `URL`; never accept a hostname by suffix matching. Reject credentials, unexpected ports, non-HTTPS URLs, extra path segments, and non-video routes.

Allow only exact host/path combinations needed by Blogr:

- `youtube.com` or `www.youtube.com` with `/watch?v=<videoId>` or `/embed/<videoId>`
- `youtube-nocookie.com` or `www.youtube-nocookie.com` with `/embed/<videoId>`
- `youtu.be/<videoId>`

Validate the video ID against the expected YouTube ID character set and length. Normalize an accepted URL to a privacy-conscious embed URL. Preserve only a small iframe attribute allowlist needed for playback. A host such as `youtube.com.attacker.example` is never valid.

Handle Blogr's multiline iframe blocks, older self-closing iframe form, standalone watch URLs, and Markdown links by transforming only validated candidates into the controlled embed component. Invalid iframe markup must be rejected or rendered as inert text, never passed through.
