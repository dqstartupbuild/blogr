# Topic and Blog List Pagination

## What It Does

The Topics and Articles tabs load one page of rows at a time. Each page shows at most 10 items, with simple Previous and Next controls.

This keeps long workspaces responsive because the list views no longer ask Convex for every topic or every blog body before rendering the page.

## How It Works

`useLiveWorkspace` owns the list filters, search text, and cursor state for the live workspace. It sends those values to Convex with `paginationOpts`.

`convex/topics/listTopics.ts` and `convex/blogs/listBlogs.ts` return Convex pagination results from lightweight read-model tables. The client maps only `result.page`, so the visible list holds the current page instead of the full workspace.

The live workspace uses one-shot Convex reads for list pages, filter options, and dashboard summary data. Local topic and article mutations bump a refresh key so the lists reload after changes without holding long-running subscriptions.

`useCursorPagination` keeps the current page cursor and a cursor history for Previous. When the user changes the workspace, search text, status filter, or blog topic filter, the cursor resets to page 1.

The Articles tab gets its topic filter choices from `listBlogTopicKeywords`. That query returns only keyword strings from `blogKeywordOptions`, not full blog records.

The dashboard uses `getWorkspaceSummary`, which reads `workspaceStats` and the five latest `blogSummaries`. This keeps dashboard counts accurate without loading every item.

## Relevant Code

- `src/features/workspace/hooks/useLiveWorkspace.ts`
- `src/features/workspace/hooks/useDemoWorkspace.ts`
- `src/features/workspace/hooks/useCursorPagination.ts`
- `src/features/workspace/hooks/useOneShotConvexQuery.ts`
- `src/features/workspace/components/ListPaginationControls.tsx`
- `src/features/workspace/components/FilteredTopicList.tsx`
- `src/features/workspace/components/FilteredBlogList.tsx`
- `src/features/workspace/constants/workspaceListPageSize.ts`
- `convex/topics/listTopics.ts`
- `convex/blogs/listBlogs.ts`
- `convex/blogs/listBlogTopicKeywords.ts`
- `convex/workspaces/getWorkspaceSummary.ts`
- `convex/readModels/*`

## Use Cases

- Browse a workspace with many saved topics without waiting for every topic to load.
- Browse generated blogs without pulling every MDX body into the list.
- Filter by status and move through matching results in small pages.
- Keep dashboard counts accurate while the Topics and Articles tabs stay lightweight.
- Avoid live subscription invalidations on list, filter, and dashboard reads that do not need live updates.

## File Tree

```text
src/features/workspace/hooks/
src/features/workspace/components/
src/features/workspace/constants/workspaceListPageSize.ts
src/features/workspace/types/ListPaginationState.ts
src/features/workspace/types/TopicListViewState.ts
src/features/workspace/types/BlogListViewState.ts
convex/readModels/
convex/topics/listTopics.ts
convex/blogs/listBlogs.ts
convex/blogs/listBlogTopicKeywords.ts
convex/workspaces/getWorkspaceSummary.ts
```
