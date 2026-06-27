# Topic and Blog List Pagination

## What It Does

The Topics and Articles tabs load one page of rows at a time. Each page shows at most 10 items, with simple Previous and Next controls.

This keeps long workspaces responsive because the list views no longer ask Convex for every topic or every blog body before rendering the page.

## How It Works

`useLiveWorkspace` owns the list filters, search text, and cursor state for the live workspace. It sends those values to Convex with `paginationOpts`.

`convex/topics/listTopics.ts` and `convex/blogs/listBlogs.ts` return Convex pagination results. The client maps only `result.page`, so the visible list holds the current page instead of the full workspace.

`useCursorPagination` keeps the current page cursor and a cursor history for Previous. When the user changes the workspace, search text, status filter, or blog topic filter, the cursor resets to page 1.

The Articles tab gets its topic filter choices from `listBlogTopicKeywords`. That query returns only keyword strings, not full blog records.

The dashboard uses `getWorkspaceSummary`, which runs only on the Dashboard tab. This keeps dashboard counts accurate without making the list pages load every item.

## Relevant Code

- `src/features/workspace/hooks/useLiveWorkspace.ts`
- `src/features/workspace/hooks/useDemoWorkspace.ts`
- `src/features/workspace/hooks/useCursorPagination.ts`
- `src/features/workspace/components/ListPaginationControls.tsx`
- `src/features/workspace/components/FilteredTopicList.tsx`
- `src/features/workspace/components/FilteredBlogList.tsx`
- `src/features/workspace/constants/workspaceListPageSize.ts`
- `convex/topics/listTopics.ts`
- `convex/blogs/listBlogs.ts`
- `convex/blogs/listBlogTopicKeywords.ts`
- `convex/workspaces/getWorkspaceSummary.ts`

## Use Cases

- Browse a workspace with many saved topics without waiting for every topic to load.
- Browse generated blogs without pulling every MDX body into the list.
- Filter by status and move through matching results in small pages.
- Keep dashboard counts accurate while the Topics and Articles tabs stay lightweight.

## File Tree

```text
src/features/workspace/hooks/
src/features/workspace/components/
src/features/workspace/constants/workspaceListPageSize.ts
src/features/workspace/types/ListPaginationState.ts
src/features/workspace/types/TopicListViewState.ts
src/features/workspace/types/BlogListViewState.ts
convex/topics/listTopics.ts
convex/blogs/listBlogs.ts
convex/blogs/listBlogTopicKeywords.ts
convex/workspaces/getWorkspaceSummary.ts
```
