# Article Version History

## What It Does

Every time a user chooses **Write blog** for a topic that already has an article, Blogr keeps the complete article that is about to be replaced. Users can open **Version history** from the article preview or editor and read any older version without changing the current article.

Older versions are read-only. They cannot be edited, restored, published, or used for image actions.

## How It Works

1. Blog generation continues through the immediate route or the durable AI worker.
2. Both generation paths locate the existing article through its linked topic.
3. Immediately before the article is replaced, `archiveBlogVersion` copies its content and metadata into the `blogVersions` table.
4. The archived record receives the next version number for that article.
5. The newly generated article remains the canonical record in `blogs`.
6. `listBlogVersions` pages through lightweight `blogVersionSummaries` rows for the selected article without loading every archived body.
7. `getBlogVersion` loads one complete archived version when the user selects it.
8. Stored R2 keys are reused to refresh expired signed image URLs before an older version is displayed.

The saved snapshot includes the title, SEO title, description, slug, MDX, feature image, article images, tags, links, sources, status, original dates, and publication date.

Deleting an article also deletes its archived versions. Normal edits and image changes update the current article without creating a version. A version is created specifically when **Write blog** replaces an existing generated article.

## User Experience

The **Version history** action appears in:

- the article preview
- the article editor header

The history dialog lists every archived version with its version number and saved date. Selecting a row opens a read-only rendering of that article. The dialog makes it clear that viewing history does not alter the current article.

## Relevant Code

- `convex/schema.ts`
- `convex/blogVersions/archiveBlogVersion.ts`
- `convex/blogVersions/buildBlogVersionSnapshot.ts`
- `convex/blogVersions/buildBlogVersionSummary.ts`
- `convex/blogVersions/deleteBlogVersions.ts`
- `convex/blogVersions/listBlogVersions.ts`
- `convex/blogVersions/getBlogVersion.ts`
- `convex/blogVersions/refreshBlogVersionImageUrls.ts`
- `convex/blogs/upsertGeneratedBlog.ts`
- `convex/aiJobs/completeBlogGenerateAiJob.ts`
- `src/features/workspace/components/ArticleVersionHistoryButton.tsx`
- `src/features/workspace/components/ArticleVersionHistoryDialog.tsx`
- `src/features/workspace/components/ArticleVersionHistoryContent.tsx`
- `src/features/workspace/components/ArticleVersionHistoryList.tsx`
- `src/features/workspace/components/ArticleVersionHistoryListItem.tsx`
- `src/features/workspace/components/ArticleVersionPreview.tsx`

## File Tree

```text
convex/
├── blogVersions/
│   ├── archiveBlogVersion.ts
│   ├── buildBlogVersionSnapshot.ts
│   ├── buildBlogVersionSummary.ts
│   ├── deleteBlogVersions.ts
│   ├── getBlogVersion.ts
│   ├── listBlogVersions.ts
│   └── refreshBlogVersionImageUrls.ts
└── schema.ts

src/
├── features/workspace/
│   ├── components/ArticleVersion*.tsx
│   ├── mappers/mapConvexBlogVersion.ts
│   └── types/ArticleVersion*.ts
└── server/convex/
    ├── castBlogVersionId.ts
    └── references/*BlogVersion*.ts
```

## Use Cases

- Compare a newly generated article with the draft it replaced.
- Review wording or research that appeared in an earlier version.
- Keep a permanent read-only record of every full rewrite.
