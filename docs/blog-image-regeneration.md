# Blog Image Regeneration

## What It Does

Users can refresh any image they don't like, right inside the AI article preview. A small "Regenerate" button sits on top of every image in the article preview, including the cover image. Clicking it opens the image prompt first, so the user can change what the next image should show before creating it. Submitting that prompt swaps the image for a freshly generated one and updates the article body so the new image shows up everywhere the old one was used.

## How It Works

The preview renders markdown through `MarkdownPreview`, which passes the blog's image list, the rendered markdown, and a regenerate callback into `buildMarkdownPreviewComponents`. Each `img` tag is replaced by `RegenerateableImage`. Every image in the preview shows a "Regenerate" button, including the cover image and any image that isn't tracked in the blog's `images` array.

To make sure the button shows on every image even after image URLs are re-signed, the preview matches markdown images to stored image prompts in three steps (`resolveBlogImageMatches`):

1. Exact URL match against the blog's `images`.
2. Stable path match: the signed R2 URL's query string changes when links are refreshed, but the path (the R2 key) stays the same, so images are matched by path when the full URL drifts.
3. Order fallback: any remaining markdown image is matched to the next unused stored image so its prompt is still available.

When the user clicks "Regenerate", `useImageRegenerationPrompt` opens `ImagePromptDialog` with the matched prompt. If there is no stored prompt, `buildImagePromptDraft` creates a simple draft from the image alt text. When the user submits the dialog, the component sends the image's `src`, alt text, matched index, and edited prompt to the regenerate callback. The cover image is rendered by `RegenerateableFeatureImage`, which uses the same callback with `isFeatureImage: true` so the server also updates the blog's `featureImageUrl`.

The regenerate callback lives in `useBlogEditor` (for the editor route) and `useLiveWorkspace` (for the workspace preview drawer). Both call `POST /api/blogs/[blogId]/regenerate-image`.

The API route resolves the target image with `resolveRegenerateImageTarget`:

- It matches the request to an existing image by index, exact URL, or stable path.
- If no stored prompt exists, it builds a prompt from the image's alt text so even untracked images can be refreshed.
- If the image isn't in the `images` array yet, the new image is appended instead of replacing one.

It regenerates the image through `regenerateBlogImage` (Replicate + R2 storage), then updates the blog's `images`, the `featureImageUrl` (when needed), and the MDX body. The MDX swap (`replaceImageUrlInMdx`) replaces the old URL everywhere it appears, falling back to a path match if the exact old URL isn't present.

## Relevant Code

- `src/app/api/blogs/[blogId]/regenerate-image/route.ts`
- `src/app/api/blogs/[blogId]/regenerate-image/schema.ts`
- `convex/blogs/updateBlogImage.ts`
- `src/server/convex/references/updateBlogImageMutation.ts`
- `src/server/blog/regenerateBlogImage.ts`
- `src/server/blog/resolveRegenerateImageTarget.ts`
- `src/server/blog/replaceImageUrlInMdx.ts`
- `src/server/blog/getImageUrlPathKey.ts`
- `src/features/workspace/utils/resolveBlogImageMatches.ts`
- `src/features/workspace/utils/buildImagePromptDraft.ts`
- `src/features/workspace/utils/getImageUrlPathKey.ts`
- `src/features/workspace/utils/getMarkdownImageUrls.ts`
- `src/features/workspace/hooks/useImageRegenerationPrompt.ts`
- `src/features/workspace/components/ImagePromptDialog.tsx`
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
- Change the prompt before refreshing so the new image matches the article better.
- Try a few variations of the same image until one fits the article.

## File Tree

```text
src/app/api/blogs/[blogId]/regenerate-image/
convex/blogs/updateBlogImage.ts
src/server/blog/regenerateBlogImage.ts
src/features/workspace/hooks/useImageRegenerationPrompt.ts
src/features/workspace/components/ImagePromptDialog.tsx
src/features/workspace/components/Regenerate*
src/features/workspace/components/markdownPreviewComponents.tsx
src/features/workspace/components/MarkdownPreview.tsx
src/features/workspace/hooks/useBlogEditor.ts
src/features/workspace/hooks/useLiveWorkspace.ts
```
