# Blog Editor

## What It Does

Users can open a generated blog and edit the article title, SEO title, meta description, and MDX. The preview renders the MDX as readable blog content.

SEO titles should stay between 70 and 110 characters. Meta descriptions should stay between 110 and 160 characters.

The editor header also lets users publish the loaded draft to the configured webhook destination or download it as a zip.

The preview also lets users refresh any image they don't like. A "Regenerate" button sits on top of every image in the preview, including the cover image. Clicking it swaps the image for a freshly generated one and updates the article body so the new image shows up everywhere the old one was used. See [blog-image-regeneration.md](blog-image-regeneration.md) for details.

## How It Works

The editor route is `/blogs/[blogId]`.

The editor waits for Clerk and Convex auth before it asks Convex for a blog. That keeps direct editor visits from firing `getBlog` before the browser has a valid workspace token.

After auth is ready, the editor loads the active product workspace and then loads the live blog through the Convex client with `getBlog`. The query includes the active product ID, so a blog from another workspace is not edited by mistake. If live mode is not available, it falls back to demo content for layout preview.

Saving uses the Convex client mutation `updateBlogContent`, so it follows the same browser auth path as the main workspace. The save call includes the active product ID.

Publishing uses `BlogPublishButton`, which sends the loaded draft to `POST /api/blogs/publish`. The publish route handles the signed-in user check, payload validation, and server-to-server webhook call.

The live editor header includes the workspace switcher. If a user switches workspaces while editing, the app returns to `/blogs` so the new workspace can show its own saved posts.

The right-side preview uses `MarkdownPreview`, so headings, links, lists, quotes, images, YouTube videos, tables, and code blocks render like a blog instead of plain markdown text.

## Relevant Code

- `src/app/blogs/[blogId]/page.tsx`
- `src/features/workspace/components/LiveBlogEditorView.tsx`
- `src/features/workspace/components/LiveBlogEditorContent.tsx`
- `src/features/workspace/components/BlogEditorView.tsx`
- `src/features/workspace/components/WorkspaceSwitcher.tsx`
- `src/features/workspace/components/BlogEditorLoadingView.tsx`
- `src/features/workspace/components/SignedOutBlogEditorView.tsx`
- `src/features/workspace/components/BlogEditorConnectionIssueView.tsx`
- `src/features/workspace/components/BlogEditorFields.tsx`
- `src/features/workspace/components/BlogEditorPreview.tsx`
- `src/features/workspace/components/BlogMdxTextarea.tsx`
- `src/features/workspace/components/MarkdownPreview.tsx`
- `src/features/workspace/components/BlogPublishButton.tsx`
- `src/features/workspace/components/BlogZipButton.tsx`
- `src/app/api/blogs/publish/route.ts`
- `src/features/workspace/hooks/useBlogEditor.ts`
- `src/features/workspace/hooks/useLiveWorkspaceSwitcher.ts`
- `convex/blogs/updateBlogContent.ts`

## Use Cases

- Fix wording after a post is generated.
- Add more examples before export.
- Publish the loaded draft to a connected blog app.
- Adjust frontmatter for the user's MDX blog setup.

## File Tree

```text
src/app/blogs/[blogId]/
src/app/api/blogs/[blogId]/
src/features/workspace/components/BlogEditor*
src/features/workspace/components/MarkdownPreview.tsx
src/features/workspace/components/LiveBlogEditorView.tsx
src/features/workspace/components/SignedOutBlogEditorView.tsx
src/features/workspace/hooks/useBlogEditor.ts
```
