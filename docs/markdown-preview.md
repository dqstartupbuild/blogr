# Markdown Preview

## What It Does

The workspace preview and editor preview render blog MDX as readable blog content instead of plain markdown text.

## How It Works

`MarkdownPreview` strips YAML frontmatter before display, converts saved YouTube iframe MDX into preview-safe markdown links, then renders the remaining markdown with `react-markdown` and `remark-gfm`.

YouTube links are rendered with `MarkdownPreviewLink`. When a link points to a playable YouTube video URL, the preview displays an embedded player instead of a text link. Normal links still render as regular links.

The preview does not mutate the stored blog body. Downloads still use the original MDX, including frontmatter, image markdown, and any YouTube iframe embeds.

The workspace preview opens in a fixed right-side sidebar so users can inspect the selected article without scrolling to the bottom of long topic or blog lists. The selected article is kept explicit after the user opens a preview, so list pagination, filters, and refreshed query results do not silently swap the drawer to a different article. The editor keeps its own side-by-side preview while a draft is open.

The CSS modules beside `MarkdownPreview` make headings, links, lists, quotes, tables, code, images, and YouTube embeds easy to scan inside the existing preview surfaces.

Preview text wraps long links and inline code on narrow screens. Content that needs to preserve its width, such as a table or fenced code block, scrolls inside its own preview area instead of widening the page. The article drawer and its content grids can shrink to the viewport, so the full article stays inside the mobile screen without clipping.

Editable image previews use one kebab menu for Regenerate, Edit alt text, Move in article, Make feature image, and Remove image. Moving an image targets a complete level-two article section, so saved image markdown is placed under a heading rather than inside a paragraph, list, table, or table of contents.

## Relevant Code

- `src/features/workspace/components/MarkdownPreview.tsx`
- `src/features/workspace/components/MarkdownPreviewLink.tsx`
- `src/features/workspace/components/YoutubeEmbed.tsx`
- `src/features/workspace/components/YoutubeEmbed.module.css`
- `src/features/workspace/components/MarkdownPreview.module.css`
- `src/features/workspace/components/BlogPreviewSidebar.tsx`
- `src/features/workspace/components/BlogPreviewPanel.tsx`
- `src/features/workspace/components/BlogEditorPreview.tsx`
- `src/features/workspace/components/ImageActionsMenu.tsx`
- `src/features/workspace/components/ImageAltTextDialog.tsx`
- `src/features/workspace/components/ImageRepositionDialog.tsx`
- `src/features/workspace/utils/mergePreviewBlogs.ts`
- `src/features/workspace/utils/stripMdxFrontmatter.ts`
- `src/features/workspace/utils/replaceYoutubeIframesWithMarkdownLinks.ts`

## Use Cases

- Browse generated blogs without reading raw markdown syntax.
- Open or close the workspace preview without losing list position.
- Edit a post while seeing a human-readable preview.
- Check generated image placement before downloading the MDX bundle.
- Update an image without editing its markdown URL by hand.
- Watch generated YouTube videos directly in the preview.

## File Tree

```text
src/features/workspace/components/MarkdownPreview.tsx
src/features/workspace/components/MarkdownPreviewLink.tsx
src/features/workspace/components/BlogPreviewSidebar.tsx
src/features/workspace/components/BlogPreviewPanel.tsx
src/features/workspace/components/YoutubeEmbed.tsx
src/features/workspace/components/YoutubeEmbed.module.css
src/features/workspace/components/MarkdownPreview.module.css
src/features/workspace/utils/mergePreviewBlogs.ts
src/features/workspace/utils/stripMdxFrontmatter.ts
src/features/workspace/utils/replaceYoutubeIframesWithMarkdownLinks.ts
docs/markdown-preview.md
```
