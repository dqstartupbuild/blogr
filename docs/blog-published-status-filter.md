# Blog Published Status Filter

## What It Does

Blogs can now be marked as published after a successful publish request. The Blogs tab has a simple filter bar so users can switch between all posts, posts that have not been published yet, and posts that have already been published.

## How It Works

Blog records store `published` as a real blog status in Convex. New generated blogs still start as `ready`, and failed generation can still save `failed`.

When a user clicks **Publish**, the app sends the blog to the configured webhook destination. After the webhook succeeds, the publish route calls `markBlogPublished`, which updates the saved blog status to `published` and moves it to the top of the list with a fresh `updatedAt`.

The article list, preview, status panel, and dashboard recent rows show both Created and Updated dates. Publishing changes Updated, while Created stays tied to the original article record.

The live Blogs panel passes the active status filter through `BlogListViewState`. `useLiveWorkspace` sends that filter to the Convex `listBlogs` query, so the tab receives one 10-row page of matching blogs. `FilteredBlogList` renders the status select without changing the selected preview. If a user publishes a previewed article and the active filter no longer includes it, the drawer stays on that article instead of jumping to the first visible row.

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
- `src/features/workspace/components/FilterSelect.tsx`
- `src/features/workspace/components/ArticleDateSummary.tsx`
- `src/features/workspace/hooks/useLiveWorkspace.ts`
- `src/features/workspace/utils/mergePreviewBlogs.ts`
- `src/features/workspace/types/BlogListViewState.ts`
- `src/features/workspace/types/BlogStatus.ts`
- `src/features/workspace/types/BlogStatusFilter.ts`

## File Tree

```text
convex/blogs/markBlogPublished.ts
src/app/api/blogs/publish/markPublishedBlogStatus.ts
src/features/workspace/components/FilteredBlogList.tsx
src/features/workspace/components/FilterSelect.tsx
src/features/workspace/utils/mergePreviewBlogs.ts
src/features/workspace/constants/blogStatusFilterOptions.ts
src/features/workspace/types/BlogListViewState.ts
src/features/workspace/types/BlogStatus.ts
src/features/workspace/types/BlogStatusFilter.ts
docs/blog-published-status-filter.md
```
