# Convex Records

## Client Usage

Call Convex from the Next route handler with `ConvexHttpClient` and the normal Convex deployment URL:

```text
CONVEX_URL=https://your-deployment.convex.cloud
```

`NEXT_PUBLIC_CONVEX_URL` is acceptable when the target app already uses it. Do not use `.convex.site` for Blogr publishing.

## Data Shape

Create or reuse a canonical article record with fields equivalent to:

- `sourceId`
- `title`
- `seoTitle`
- `slug`
- `description`
- `contentMdx`
- `featureImageUrl` or `featureImageKey`
- `tags`
- `source`
- `publishedAt`
- `updatedAt`

Index both `sourceId` and `slug`. Match the stable Blogr `sourceId` first, then use `slug` as the compatibility fallback for older records.

## Summary Records

Public list and discovery views should use lightweight records, selected fields, or read models. A summary record should contain only what these views need, such as:

- `title`
- `slug`
- `description`
- `featureImageUrl` or `featureImageKey`
- `tags`
- `publishedAt`
- `updatedAt`

Do not load full article MDX, full image arrays, or large metadata for blog indexes, sitemap, feeds, search, related posts, static params, or filter choices.

## Mutations And Queries

Prefer focused Convex functions:

- upsert by source ID with a slug fallback
- get one article by slug
- list summaries with cursor pagination
- list sitemap/feed metadata

On webhook create or update, update the canonical article and summary/read-model data in the same write flow so public reads stay cheap.

## Required Checks

- Publishing the same source ID or slug twice updates one article.
- `update_article` preserves the original publication date and refreshes content, SEO fields, summaries, and the updated date.
- Public blog lists do not query full article bodies.
- The route never calls Convex through `.convex.site`.
