# Blog Image Regeneration

## What It Does

Users can refresh any image they don't like, right inside the AI article preview. A small "Regenerate" button sits on top of every image in the article preview, including the cover image. Clicking it swaps the image for a freshly generated one and updates the article body so the new image shows up everywhere the old one was used.

## How It Works

The preview renders markdown through `MarkdownPreview`, which now passes the blog's image list and a regenerate callback into `buildMarkdownPreviewComponents`. Each `img` tag is replaced by `RegenerateableImage`, which looks up the matching image in the blog's `images` array by URL. When the user clicks "Regenerate", the component calls the regenerate callback with the image's index, alt text, and original prompt.

The cover image is rendered by `RegenerateableFeatureImage`, which uses the same callback with `isFeatureImage: true` so the server also updates the blog's `featureImageUrl`.

The regenerate callback lives in `useBlogEditor` (for the editor route) and `useLiveWorkspace` (for the workspace preview drawer). Both call `POST /api/blogs/[blogId]/regenerate-image` with the image index, alt text, prompt, and an optional `isFeatureImage` flag.

The API route regenerates the image through `regenerateBlogImage`, which calls Replicate with the original prompt and stores the result in R2. It then updates the blog's `images` array, the `featureImageUrl` (when needed), and the MDX body — replacing the old image URL with the new one everywhere it appears.

## Relevant Code

- `src/app/api/blogs/[blogId]/regenerate-image/route.ts`
- `src/app/api/blogs/[blogId]/regenerate-image/schema.ts`
- `convex/blogs/updateBlogImage.ts`
- `src/server/convex/references/updateBlogImageMutation.ts`
- `src/server/blog/regenerateBlogImage.ts`
- `src/features/workspace/components/RegenerateImageButton.tsx`
- `src/features/workspace/components/RegenerateableImage.tsx`
- `src/features/workspace/components/RegenerateableFeatureImage.tsx`
- `src/features/workspace/components/markdownPreviewComponents.tsx`
- `src/features/workspace/components/MarkdownPreview.tsx`
- `src/features/workspace/components/BlogEditorPreview.tsx`
- `src/features/workspace/components/BlogPreviewPanel.tsx`
- `src/features/workspace/components/BlogPreviewSidebar.tsx`
- `src/features/workspace/components/BlogEditorView.tsx`
- `src/features/workspace/components/WorkspaceContent.tsx`
- `src/features/workspace/hooks/useBlogEditor.ts`
- `src/features/workspace/hooks/useLiveWorkspace.ts`
- `src/features/workspace/types/RegenerateBlogImage.ts`
- `src/features/workspace/types/BlogImageItem.ts`

## Use Cases

- Swap a cover image that doesn't match the article tone.
- Replace a supporting image that looks off-brand or low quality.
- Try a few variations of the same image until one fits the article.

## File Tree

```text
src/app/api/blogs/[blogId]/regenerate-image/
convex/blogs/updateBlogImage.ts
src/server/blog/regenerateBlogImage.ts
src/features/workspace/components/Regenerate*
src/features/workspace/components/markdownPreviewComponents.tsx
src/features/workspace/components/MarkdownPreview.tsx
src/features/workspace/hooks/useBlogEditor.ts
src/features/workspace/hooks/useLiveWorkspace.ts
```