# Blogr Publishing Contract

## Source Of Truth

When the Blogr source checkout is available, inspect the current sender before changing the receiver contract:

- `convex/products/blogPublishArticleValidator.ts`
- `convex/products/blogPublishPayloadValidator.ts`
- `convex/products/publishBlogWithIntegration.ts`
- `src/features/workspace/constants/publishing/blogPublishingPayloadExample.ts`
- `src/features/workspace/utils/buildBlogPublishingIntegrationPrompt.ts`
- `src/server/publishing/buildBlogPublishArticle.ts` and `src/server/publishing/getBlogPublishImageUrl.ts`

These paths are in Blogr, not the receiving app. A separately installed skill can use this bundled contract and its fixtures for a fresh setup; do not block because the target lacks Blogr's source files. If observed payloads differ, obtain the sender version or supplied payload before changing the contract. Fixtures in `assets/fixtures/` are test inputs and should be checked against the sender when available.

## Endpoint And Authentication

Create:

```text
POST /api/webhooks/blog-publisher
Authorization: Bearer <token>
```

Compare the bearer token to server-only `BLOG_PUBLISH_WEBHOOK_TOKEN`. Return `401` with `{ "error": "Invalid access token." }` when it is missing or wrong. Avoid detailed public errors that reveal credentials, storage paths, or provider responses.

Route authentication is only the first boundary. The route's Convex client must also call publishing functions that enforce server authorization at the Convex function boundary; see [Convex records](convex.md).

## Envelope And Events

Validate the complete envelope, including `event_type`, ISO `timestamp`, and `data`:

- `publish_articles` requires a non-empty `data.articles` array.
- `update_article` requires `data.article`.
- Reject an event with the wrong data arm, unknown fields that the target intentionally forbids, or missing required fields with `400`.

Blogr waits 15 seconds for the entire webhook response. Set bounded article and image counts, bounded media concurrency, per-download timeouts, streaming byte limits, and an overall route budget that leaves time to return the response. Reject an oversized batch before side effects. Return `200` with `{ "message": "Published." }` only after images and database records are durable. Do not send an early success response unless both products deliberately adopt a durable asynchronous receipt protocol.

## Article Fields

The current sender requires:

- `id`, `title`, `seo_title`, `slug`, and `meta_description`
- `content_format`, currently the literal `mdx`
- `content_markdown`, `content_mdx`, and `content_html`
- `image_url`, `tags`, `source`, `created_at`, and `updated_at`

Map `id` to a stable `sourceId`. Store visible title and SEO title separately. Use `content_mdx` as the body, with `content_markdown` as fallback. `content_html` is a supplied compatibility field, not a trusted rendering shortcut; do not render it unsanitized or prefer it over the controlled Markdown path. `source` is a sending-app label, not an author.

The `image_url` field is required but can be the empty string when Blogr has no feature image. Treat that as no feature image, skip that download, and still process any body/frontmatter images. A non-empty malformed image URL remains invalid.

Treat `created_at` and `updated_at` as Blogr publication timestamps. On `update_article`, preserve the existing canonical article's original publication time while refreshing its title, SEO fields, body, images, tags, source, update time, summary record, and caches.

## Identity, Ownership, And Atomicity

Normalize the complete request, reject duplicate source IDs or slugs within the incoming batch, then preflight every article before downloading images or writing data:

1. Look up the stable Blogr source ID.
2. Only for a legacy record without a source ID, fall back to slug and bind that row to the incoming stable source ID.
3. Check the requested slug even when the source-ID lookup succeeds. If it belongs to another canonical record, reject the whole request with `409`, including a different established source ID or a separate legacy row. Bind a legacy row only when no source-ID match exists. Never overwrite or silently merge unrelated content.
4. If any match belongs to a `preparing`, `prepared`, or `active` repo-ingestion batch, reject the whole request before side effects.

Use actionable wording that matches the actual revision model, for example:

```text
Article <sourceId> is attached to repo batch <batchId> (<status>). Abort or roll back that batch as allowed, republish through Blogr, then prepare, deploy, and activate a new revision.
```

Do not promise that editing and committing the current file is enough. Its SHA-256 no longer matches the active prepared revision.

Upload images outside the database transaction. Then call one bounded Convex mutation that repeats ownership and collision checks and atomically writes all accepted canonical articles plus their summary/read-model rows. On a confirmed transaction rejection, delete only objects proven to have been created by this request, or use an explicit reservation. Never delete shared or pre-existing keys. A timeout or disconnected response does not prove the mutation failed: retain uploads until an authorized operation-status/reservation check can establish that they are uncommitted. A cache-refresh failure after a confirmed commit must not trigger image cleanup either.

Publishing the same source ID in separate requests must update one article. A mixed protected/new request must create no canonical records; normal preflight rejection must create no images. After a concurrent final rejection, clean request-owned uploads best effort and track any cleanup failure for reconciliation. R2 and Convex cannot commit atomically together.

## Fixtures

Use:

- `assets/fixtures/publish-articles.json`
- `assets/fixtures/update-article.json`
- `assets/fixtures/publish-articles-multimedia.json`

Mock remote image responses. Assert that durable records contain target-owned object keys or serving URLs, never the reserved fixture origins.
