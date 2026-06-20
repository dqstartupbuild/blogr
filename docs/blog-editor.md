# Blog Editor

## What It Does

Users can open a generated blog and edit the title, summary, and MDX.

## How It Works

The editor route is `/blogs/[blogId]`.

The editor tries to load the live blog through `GET /api/blogs/[blogId]`. If live data is not available, it falls back to demo content for layout preview.

Saving calls `PATCH /api/blogs/[blogId]`, which updates the Convex blog through `updateBlogContent`.

The load and save routes first try the normal Clerk-to-Convex token path. If
that token is not available in a preview deployment, the route uses the Clerk
user id it already authenticated and asks Convex to load or update only a blog
owned by that user.

## Relevant Code

- `src/app/blogs/[blogId]/page.tsx`
- `src/features/workspace/components/BlogEditorView.tsx`
- `src/features/workspace/components/BlogEditorFields.tsx`
- `src/features/workspace/components/BlogMdxTextarea.tsx`
- `src/features/workspace/hooks/useBlogEditor.ts`
- `src/app/api/blogs/[blogId]/route.ts`
- `src/server/convex/fetchRouteBlog.ts`
- `src/server/convex/updateRouteBlogContent.ts`
- `convex/blogs/updateBlogContent.ts`
- `convex/blogs/updateBlogContentForRoute.ts`

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
