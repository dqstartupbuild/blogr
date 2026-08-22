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
- `ingestionBatchId` (authority is derived from its batch status)
- `repoPath`
- `repoRevisionSha256`
- `repoPreparedAt`, `repoActivatedAt`, and optional rollback timestamp

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

## Repo Ownership State

The repo ingestion command needs focused, optimistic Convex mutations/queries for paginated exports, prepare completion, activation, abort, and rollback. Create independent ingestion-batch/manifest records with batch ID, schema version, deterministic entry set/hash, and status `preparing`, `prepared`, `active`, `rolled_back`, or `aborted`. Articles and summaries reference their batch ID, deterministic repo path, and SHA-256 revision; database/repo-pending/repo authority is derived from the batch status rather than independently toggled per article. A source ID or slug may not belong to multiple non-rolled-back/non-aborted batches.

Prepare prints and persists its batch ID, may attach validated staged pages to that `preparing` batch for safe resumption, and must not mark it `prepared` until all pages have passed validation and written atomically. Preparing/prepared batches remain database-authoritative. A partial failure exits nonzero with no authority transition. Activation requires an explicit batch ID, verifies that batch's deployed manifest entries/hash, and atomically compare-and-sets only that `prepared` batch record to `active`. Activating batch B does not deactivate active batch A. A bad deployment URL, schema, tuple, batch status, or hash mismatch must fail without changing authority. Abort only accepts preparing/prepared batches, detaches their records to restore database authority, marks the batch `aborted`, and retains generated files/data for explicit cleanup. Rollback flips only the selected active batch to `rolled_back`; retain database data and repo metadata/files for explicit cleanup later.

Webhook upserts must preflight the complete payload by stable source ID first, then slug, before image downloads or any other side effect. If any matching record belongs to a preparing, prepared, or active batch, reject the entire request with an actionable HTTP `409`: edit and commit repo content, or roll back to database authority and republish before preparing again. After request-owned R2 uploads, repeat the ownership check transactionally before final writes; on a rejected concurrent change, delete only objects created by that request or use an explicit reservation. New records and database-authoritative records continue through normal publication. Do not expose ingestion mutations publicly or place credentials/secrets in client code, command arguments, or logs.

## Required Checks

- Publishing the same source ID or slug twice updates one article.
- `update_article` preserves the original publication date and refreshes content, SEO fields, summaries, and the updated date.
- Public blog lists do not query full article bodies.
- The route never calls Convex through `.convex.site`.
- A webhook payload containing any preparing/prepared/active article returns `409` before side effects; a new-only payload still publishes.
- Database records and summaries are never automatically deleted during prepare, activation, or rollback.
