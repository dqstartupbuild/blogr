# Blog Publication Timestamps

## Overview

Articles now show three separate dates: Created, Updated, and Published. This makes it clear when an article was first made, when it last changed, and when it first went live.

## How It Works

1. New articles save `createdAt` and `updatedAt` as before.
2. The first successful publish saves `publishedAt` and changes the article status to `published`.
3. Publishing again keeps the original `publishedAt`, while later edits continue changing `updatedAt`.
4. Blog summaries include `publishedAt`, so article lists and dashboard rows can show all three dates without loading full article content.
5. Older published articles without `publishedAt` show their last known update as the best available publication date.
6. Unpublished articles show **Published Not yet**.

## Calendar Status

Publishing also changes the linked topic status to `published` and updates its topic read model in the same Convex mutation. The calendar receives that lightweight topic row through its existing query and shows **Published** immediately.

When the calendar opens, `backfillWrittenTopicCalendarDates` also compares older linked topics with blog summaries. Existing published articles therefore repair stale **Article ready** calendar statuses without requiring a separate calendar query.

## Relevant Code

- `convex/schema.ts`
- `convex/blogs/markBlogPublished.ts`
- `convex/blogs/resolveBlogPublishedAt.ts`
- `convex/readModels/buildBlogSummary.ts`
- `convex/topics/backfillWrittenTopicCalendarDates.ts`
- `convex/topics/resolveTopicStatusFromBlog.ts`
- `src/features/workspace/components/ArticleDateSummary.tsx`
- `src/features/workspace/utils/getBlogPublishedAt.ts`

## Use Cases

- See when an article was originally created.
- See whether edits happened after publication.
- Confirm when an article first went live.
- Distinguish unpublished articles from published ones at a glance.
- See an accurate Published status on the content calendar.

## Source References

- `docs/blog-published-status-filter.md`
- `docs/content-calendar.md`
- `docs/convex-data.md`

## File Tree

```text
convex/blogs/
├── markBlogPublished.ts
└── resolveBlogPublishedAt.ts
convex/topics/
├── backfillWrittenTopicCalendarDates.ts
└── resolveTopicStatusFromBlog.ts
src/features/workspace/components/
  ArticleDateSummary.tsx
src/features/workspace/utils/
  getBlogPublishedAt.ts
docs/
  blog-publication-timestamps.md
```
