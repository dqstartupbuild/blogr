# Blog Published Status Filter

## What It Does

Blogs can now be marked as published after a successful publish request. The Blogs tab has a simple filter bar so users can switch between all posts, posts that have not been published yet, and posts that have already been published.

## How It Works

Blog records store `published` as a real blog status in Convex. New generated blogs still start as `ready`, and failed generation can still save `failed`.

When a user clicks **Publish**, the app sends the blog to the configured webhook destination. After the webhook succeeds, the publish route calls `markBlogPublished`, which updates the saved blog status to `published` and moves it to the top of the list with a fresh `updatedAt`.

The Blogs panel uses `FilteredBlogList`. That wrapper owns the active filter state, renders `BlogStatusFilterTabs`, filters rows with `filterBlogsByStatus`, and keeps the preview pointed at a blog in the selected view when possible.

## Use Cases

- See which finished drafts still need to be published.
- Confirm which blogs have already been sent to the public blog app.
- Keep published posts separate while planning refresh work.

## Relevant Code

- `convex/schema.ts`
- `convex/blogs/markBlogPublished.ts`
- `src/app/api/blogs/publish/route.ts`
- `src/app/api/blogs/publish/markPublishedBlogStatus.ts`
- `src/features/workspace/components/FilteredBlogList.tsx`
- `src/features/workspace/components/BlogStatusFilterTabs.tsx`
- `src/features/workspace/utils/filterBlogsByStatus.ts`
- `src/features/workspace/types/BlogStatus.ts`
- `src/features/workspace/types/BlogStatusFilter.ts`

## File Tree

```text
convex/blogs/markBlogPublished.ts
src/app/api/blogs/publish/markPublishedBlogStatus.ts
src/features/workspace/components/FilteredBlogList.tsx
src/features/workspace/components/BlogStatusFilterTabs.tsx
src/features/workspace/constants/blogStatusFilterOptions.ts
src/features/workspace/utils/filterBlogsByStatus.ts
src/features/workspace/types/BlogStatus.ts
src/features/workspace/types/BlogStatusFilter.ts
docs/blog-published-status-filter.md
```
