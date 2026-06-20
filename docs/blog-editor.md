# Blog Editor

## What It Does

Users can open a generated blog and edit the title, summary, and MDX.

## How It Works

The editor route is `/blogs/[blogId]`.

The editor tries to load the live blog through `GET /api/blogs/[blogId]`. If live data is not available, it falls back to demo content for layout preview.

Saving calls `PATCH /api/blogs/[blogId]`, which updates the Convex blog through `updateBlogContent`.

## Relevant Code

- `src/app/blogs/[blogId]/page.tsx`
- `src/features/workspace/components/BlogEditorView.tsx`
- `src/features/workspace/components/BlogEditorFields.tsx`
- `src/features/workspace/components/BlogMdxTextarea.tsx`
- `src/features/workspace/hooks/useBlogEditor.ts`
- `src/app/api/blogs/[blogId]/route.ts`
- `convex/blogs/updateBlogContent.ts`

## Use Cases

- Fix wording after a post is generated.
- Add more examples before export.
- Adjust frontmatter for the user's MDX blog setup.

## File Tree

```text
src/app/blogs/[blogId]/
src/app/api/blogs/[blogId]/
src/features/workspace/components/BlogEditor*
src/features/workspace/hooks/useBlogEditor.ts
```
