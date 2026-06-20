# Markdown Preview

## What It Does

The workspace preview and editor preview render blog MDX as readable blog content instead of plain markdown text.

## How It Works

`MarkdownPreview` strips YAML frontmatter before display, then renders the remaining markdown with `react-markdown` and `remark-gfm`.

The stored blog body is not changed. Downloads still use the original MDX, including frontmatter and image markdown.

The CSS module beside `MarkdownPreview` makes headings, links, lists, quotes, tables, code, and images easy to scan inside the existing preview panels.

## Relevant Code

- `src/features/workspace/components/MarkdownPreview.tsx`
- `src/features/workspace/components/MarkdownPreview.module.css`
- `src/features/workspace/components/BlogPreviewPanel.tsx`
- `src/features/workspace/components/BlogEditorPreview.tsx`
- `src/features/workspace/utils/stripMdxFrontmatter.ts`

## Use Cases

- Browse generated blogs without reading raw markdown syntax.
- Edit a post while seeing a human-readable preview.
- Check generated image placement before downloading the MDX bundle.

## File Tree

```text
src/features/workspace/components/MarkdownPreview.tsx
src/features/workspace/components/MarkdownPreview.module.css
src/features/workspace/utils/stripMdxFrontmatter.ts
docs/markdown-preview.md
```
