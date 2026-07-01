# Convex Read Models

## What It Does

The workspace uses small Convex read-model tables for screens that only need list rows, filter options, workspace names, or dashboard totals. This keeps common reads from pulling full article bodies, raw product scan context, image arrays, and link arrays.

## How It Works

`blogSummaries` stores the fields needed by article lists and recent article cards. Full article content stays in `blogs` and is fetched only when a user previews or edits one article.

`topicKeywordOptions` stores the fields needed by the topic list, calendar picker, and topic planning context.

`blogKeywordOptions` stores article keywords for the article topic filter and topic planning context.

`workspaceStats` stores dashboard counts for topics, articles, published articles, and images.

`productWorkspaceSummaries` stores workspace switcher rows without the raw scanned site context.

`productProfiles` stores the product fields needed by ordinary workspace screens, settings, link controls, and publishing controls. It excludes the full raw scanned site context, competitors, and image arrays.

Full `products` records are still available for work that needs the complete scanned context, such as topic discovery, topic briefs, calendar planning, and article refresh planning. Those reads happen on demand when a user starts that work instead of through a live subscription on every workspace screen.

The read models are updated by the existing product, topic, blog, and AI-job mutations. `ensureWorkspaceReadModels` rebuilds missing rows for older workspaces and patches legacy topic or article records that do not have a workspace ID yet.

## Use Cases

- Open article and topic lists without reading full article bodies.
- Show dashboard totals without counting every topic and article on each visit.
- Fill filter menus without scanning full article or topic records.
- Keep workspace switching light even when product scans have large raw context.
- Show product settings without subscribing to raw scanned site context.
- Load the full product only when generation or research work needs it.

## Relevant Code

- `convex/schema.ts`
- `convex/readModels/*`
- `convex/blogs/listBlogs.ts`
- `convex/topics/listTopics.ts`
- `convex/workspaces/getWorkspaceSummary.ts`
- `convex/products/getProductWorkspaces.ts`
- `convex/products/getCurrentProductProfile.ts`
- `src/features/workspace/hooks/useOneShotConvexQuery.ts`
- `src/features/workspace/hooks/useLiveWorkspace.ts`

## File Tree

```text
convex/readModels/
convex/blogs/
convex/topics/
convex/workspaces/
convex/products/
src/features/workspace/hooks/
src/features/workspace/mappers/
```

## Source References

- Convex realtime caching: https://docs.convex.dev/realtime
- Convex query best practices: https://docs.convex.dev/understanding/best-practices/
