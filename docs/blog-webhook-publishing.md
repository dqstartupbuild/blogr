# Blog Webhook Publishing

## What It Does

Users can publish a generated blog to another app with the **Publish** button.

The target app owns the public blog. This app sends the generated article to that target app through a bearer-token webhook, using the same shape as the Outrank-style webhook reference.

Each product workspace can have its own publishing integration. This lets one account publish different products or clients to different blog apps without changing deployment env vars.

## How It Works

1. A user clicks **Publish** from the blog preview or editor header.
2. The client calls `POST /api/blogs/publish` with the loaded blog draft.
3. The route checks the signed-in user with `requireRouteUserId`.
4. The route validates the blog payload with the shared blog item schema.
5. `buildBlogPublishPayload` sends `publish_articles` for a first publication and `update_article` when the article has been published before. Both payloads include clean article tags.
6. If the blog belongs to a product workspace, the route calls the Convex `publishBlogWithIntegration` action.
7. The Convex action reads the saved publishing integration for that product without returning the token to the browser.
8. If the product does not have a saved integration, the route falls back to the deployment env vars.
9. The webhook request is sent with `Authorization: Bearer <token>`.
10. The target app copies article images into its own durable storage, rewrites saved image references to object keys or stable serving URLs, and creates or updates the public post by stable Blogr ID with legacy slug fallback.
11. After a successful webhook response, Blogr marks the saved blog as `published`.

Publishing uses the currently loaded draft. In the editor, that means a user can publish the text they are looking at after making changes.

Published blogs keep their `published` status in the Blogs tab, so users can filter published posts away from drafts that still need to be sent.

Tags come from the saved blog tag list when it exists. Older blogs get clean fallback tags from the current keyword, title, SEO title, and meta description. Internal planning phrases are removed before the tags are sent.

On first publication, the article `created_at` and `updated_at` values use the time the user clicks **Publish**. When the user republishes it, `created_at` keeps that original publication time and `updated_at` records the latest successful republish.

## Settings Workflow

Open **Settings** for the active product workspace, then use the **Publishing** panel.

The panel starts with a **Setup guide**. It gives the user a copyable integration prompt for the target app, the webhook path, the token env var, a sample payload, and a quick checklist for the receiving app.

The integration prompt works with any coding agent. It first tells the agent to download the complete [`$blogr-publishing-receiver` skill folder](https://github.com/dqstartupbuild/blogr/tree/main/codex-skills/blogr-publishing-receiver), install it in the agent's supported skills directory, read `SKILL.md`, and use the skill. If the agent cannot access or install skills, the complete fallback brief remains in the prompt so setup can continue. This first version focuses only on Next.js App Router targets that use Convex article records and Cloudflare R2 for copied article images.

The repo-owned skill lives in `codex-skills/blogr-publishing-receiver/`. It routes each task to focused references for the webhook contract, Next.js App Router, Convex records, R2 image storage, safe MDX rendering, optional repo ingestion, and acceptance tests. A renderer repair does not load or add ingestion unless the user asks. The skill also includes fixture payloads for `publish_articles`, `update_article`, and a multimedia article with frontmatter, markdown images, tables, code, and a multiline YouTube iframe.

The prompt and skill steer target apps away from forwarding Blogr publishing requests to Convex HTTP actions. The target webhook validates the token, parses the payload, copies images, calls Convex through a request-scoped client on the normal `.convex.cloud` URL, and revalidates blog routes from the receiving server route. Every callable publishing or ingestion Convex function must also authorize at the Convex boundary, because Next route authentication alone does not stop a direct call. They explicitly say not to add or rely on `CONVEX_SITE_URL`, `NEXT_PUBLIC_CONVEX_SITE_URL`, or `.convex.site` for Blogr publishing.

The prompt and skill also tell the target app to keep public blog reads small. Convex targets should use lightweight summary or read-model records for blog lists, sitemap/feed metadata, search/filter data, and static params instead of loading full article bodies or image arrays.

## Moving Published Blogs Into The Target Repo

The target-app prompt and receiver skill also cover an optional, deployment-safe way to move already published database articles into checked-in MDX. This is a user-run migration workflow, not runtime local-file storage.

The target app provides a two-phase command such as:

```bash
npm run blogr:ingest
# Commit and deploy the generated MDX.
npm run blogr:ingest -- --activate --batch=<batchId> --deployment-url=https://your-target-app.com
# For an incomplete batch that should not be activated:
npm run blogr:ingest -- --abort --batch=<batchId>
```

Prepare exports published articles with deterministic paths and SHA-256 revisions, validates frontmatter and paths, detects collisions, and uses staging plus atomic writes. It prints and persists an independent ingestion batch ID with an entry set/hash and preparing, prepared, active, rolled_back, or aborted status. Pages may be safely resumed while preparing, but only a completely successful multi-page prepare marks that batch prepared; those articles continue to be served from Convex until activation. A source ID or slug cannot belong to more than one non-rolled-back/non-aborted batch. The command supports dry runs, targeted/all exports, abort for preparing/prepared batches, and rollback for active batches. It never commits, pushes, deploys, deletes database records, prunes files, or overwrites unmanaged files. Images remain in the target app's R2 storage.

Activation verifies a schema-versioned manifest served by the deployed target app for the explicit batch ID. The manifest is generated at build time from exact checked-in MDX bytes, never database/dynamic data, is keyed by batch ID, and must match every prepared stable Blogr ID, repo path, SHA-256 revision, and that batch's entry set/hash. Activation only accepts `BLOG_REPO_DEPLOYMENT_ORIGIN`, the configured canonical/allowlisted HTTPS origin, with no embedded credentials, redirects, or off-origin response. One database compare-and-set flips only the selected prepared batch to active if its schema/version and entry set/hash still match; activating a later batch does not deactivate an earlier active one. Public pages resolve repo content first only for active batches with matching deployed artifacts; otherwise they retain the Convex copy, which avoids blank pages and duplicates during rolling deploys, failed deploys, and rollback. Lists, sitemap, feeds, search, and static params merge all active manifests and database summaries, deduplicating by stable ID then slug.

Set `BLOG_REPO_INGEST_SECRET` to a long random value in the authorized local or CI environment and in the target's Convex/server environment. An existing named admin/deploy mechanism may replace it. Never pass the secret in command arguments, browser code, or logs.

Before image downloads or any other side effect, the target app preflights the entire webhook payload by stable ID, then legacy slug. It rejects duplicate incoming IDs/slugs and checks the requested slug even when the ID matches. Another canonical row on that slug is a conflict, never an overwrite. If any article belongs to a preparing, prepared, or active batch, the whole request receives `409` with the batch ID/status and the supported recovery cycle: abort or roll back as allowed, republish through Blogr, then prepare, deploy, and activate a new revision. Editing and committing the current file alone changes its SHA-256 and cannot activate it. The target repeats ownership checks in one bounded mutation that also writes every accepted canonical article and summary atomically. Confirmed rejection cleans only request-owned R2 objects; a timeout retains uploads until reconciliation resolves whether they committed. A cache-refresh error cannot delete committed images. New-only payloads continue to publish to the database.

Preparation claims exported pages with a comparison against current database revisions and rechecks the full claim set before completion, preventing stale exports during concurrent publication. Activation and rollback refresh cached authority and discovery reads. Private image redirects must not be cached beyond signature expiry, and public-URL download validation binds the actual connection to approved addresses to prevent DNS rebinding.

The user enters:

- Webhook URL
- Access token
- Publisher label

The access token is saved server-side in Convex and is not returned to the browser. The settings screen only shows whether a token is already saved.

Click **Save publishing** to connect that product. Click **Remove** to disconnect publishing for that product.

If a user clicks **Publish** before connecting a product, the publish message includes a **Set up publishing** shortcut back to Settings.

## Env Fallback

Product settings are the normal setup path. Env vars still work as a fallback for demos, previews, or single-destination deployments.

Set these env vars on the Blogr deployment:

```bash
BLOG_PUBLISH_WEBHOOK_URL=https://your-target-app.com/api/webhooks/blog-publisher
BLOG_PUBLISH_WEBHOOK_TOKEN=replace-with-a-long-secret
BLOG_PUBLISH_SOURCE_NAME=Blogr
BLOG_PUBLISH_TIMEOUT_MS=15000
```

`BLOG_PUBLISH_SOURCE_NAME` defaults to `Blogr`. `BLOG_PUBLISH_TIMEOUT_MS` defaults to 15000 and is capped at 60000.

## Webhook Payload

The route sends this shape:

```json
{
  "event_type": "publish_articles",
  "timestamp": "2026-06-23T16:00:00.000Z",
  "data": {
    "articles": [
      {
        "id": "blog-id",
        "title": "A Helpful Blog Title",
        "seo_title": "A Helpful Blog Title for Search Results With Clear Next Steps and Examples",
        "slug": "a-helpful-blog-title",
        "meta_description": "A helpful plain-English summary that tells readers what they will learn, why it matters, and what next step they can take.",
        "content_format": "mdx",
        "content_markdown": "---\\ntitle: ...",
        "content_mdx": "---\\ntitle: ...",
        "content_html": "",
        "image_url": "https://example.com/image.jpg",
        "tags": ["content planning", "team priorities", "weekly planning"],
        "source": "Blogr",
        "created_at": "2026-06-23T16:00:00.000Z",
        "updated_at": "2026-06-23T16:00:00.000Z"
      }
    ]
  }
}
```

MDX is the source of truth. The sender requires `content_html` as a compatibility field and currently sends it blank, but receivers must not treat it as a trusted rendering shortcut. Blogr can include YAML frontmatter, H1 through H6 headings, markdown images, tables, code blocks, and YouTube iframe embeds in the MDX body.

## Target App Expectations

The receiving app should:

- Accept `POST /api/webhooks/blog-publisher`.
- Read `Authorization: Bearer <token>`.
- Compare the token to `BLOG_PUBLISH_WEBHOOK_TOKEN`.
- Validate `event_type`, `timestamp`, and article fields.
- Finish the durable R2 and database work inside Blogr's 15-second total response window. Bound the article/image counts, streaming bytes, media concurrency, and timeouts; do not return success early.
- Match existing posts by the stable Blogr article ID first, then by `slug` for older records.
- Use slug fallback only for a legacy record without a source ID. Reject a slug owned by a different source ID.
- For database-authoritative posts, update the existing post when the same blog is published again.
- For database-authoritative creates or updates, save the current title, SEO title, meta description, body, images, tags, source, and timestamps from the payload.
- For database-authoritative updates, preserve the original `created_at` and replace `updated_at` with the latest successful republish time.
- Store `seo_title` separately from the visible article title.
- Keep `seo_title` between 70 and 110 characters and `meta_description` between 110 and 160 characters.
- Store `content_mdx` or `content_markdown`.
- Treat `image_url` and markdown image URLs as temporary source URLs.
- For database-authoritative payloads, download article images during the webhook request, store them in Cloudflare R2, and rewrite `image_url`, frontmatter `featureImage`, and markdown image URLs to object keys or stable serving URLs before saving the post. Do not persist expiring presigned URLs.
- Treat remote images as SSRF input: use a trusted-host allowlist or validated public-address strategy, validate redirects, block private/special-use addresses and URL credentials, enforce streaming byte limits, verify raster types, and reject SVG by default.
- Before any side effects, preflight the full webhook payload. If any article belongs to a preparing, prepared, or active ingestion batch, return whole-request `409` with the recovery message and make no article/image changes.
- Own the publishing orchestration in the receiving server route. Do not forward Blogr publishing to Convex HTTP actions or `.convex.site`.
- Use Convex for article records. Call Convex from the receiving server route with `ConvexHttpClient` and `CONVEX_URL` or `NEXT_PUBLIC_CONVEX_URL` on `.convex.cloud`.
- Authorize every callable Convex publishing and ingestion function with an existing server identity or a dedicated secret set in hosting and Convex environments.
- Keep public blog reads small. Do not load full article bodies, MDX, image arrays, or large metadata for blog index pages, sitemap, RSS/feed, search, related posts, static params, or filter views.
- Store full content in the canonical article record, but use lightweight Convex summary or read-model records for list and discovery views.
- Update any summary or read-model data during database-authoritative webhook create or update, and revalidate cached blog pages after publishing.
- Use indexed slug lookups and cursor pagination for lists.
- Prefer read-model tables for public lists, sitemap/feed metadata, and search/filter options. Avoid live subscriptions on public blog pages unless live updates are truly needed.
- Do not require `CONVEX_SITE_URL`, `NEXT_PUBLIC_CONVEX_SITE_URL`, `R2_TOKEN`, `R2_PUBLIC_URL`, an R2 custom domain, a public bucket, or whole-bucket public access.
- Finish with a required setup handoff that names every variable and groups it by where it must be set, including hosting/server env vars, Convex deployment env vars, Cloudflare/R2 setup, database setup, Blogr Settings, optional follow-ups, and verification commands.
- Treat the Blogr publisher label as the webhook payload's `source` value. It is a sending-app label, not the article author.
- Render Blogr MDX features including frontmatter stripping, H1 through H6 headings, links, lists, blockquotes, tables, code, markdown images, and YouTube iframe embeds or YouTube links.
- Never compile received MDX or exported article files as trusted JavaScript. Reject imports, exports, JSX expressions, arbitrary components, scripts, unsafe handlers/URLs, and unapproved raw HTML; sanitize the allowed subset.
- Render article `#` H1 lines as headings while keeping generated table-of-contents entries focused on H2 through H6 sections.
- Support Blogr's multi-line YouTube iframe blocks and older self-closing iframe variants. If the target renderer would show the iframe markup as raw text, transform whitelisted YouTube iframe markup into a safe embed component before rendering.
- Include webhook-published posts in sitemap/feed outputs and refresh cached blog pages after publishing.
- Return a JSON response with `{ "message": "Published." }`.
- Do not use runtime mutable local files or serverless temporary storage for articles. Deterministic MDX produced by the explicit ingestion command, committed, and deployed is the sole exception; keep images in R2 unless explicitly requested otherwise.

## Troubleshooting

If publishing works for one product but fails for another with `Method Not Allowed`, that product is usually connected to the wrong receiving URL.

Check that product's **Settings** page and make sure the Webhook URL points to the receiving app's blog publishing endpoint, not a public blog page or another API route. The receiving route must accept `POST /api/webhooks/blog-publisher`.

If the receiving app logs `Invalid access token.`, the webhook URL is correct but the saved token does not exactly match the target app's `BLOG_PUBLISH_WEBHOOK_TOKEN` in the active deployment. Check for copied spaces, quotes, stale deployment env vars, or setting the token in the wrong environment.

## Security

The target webhook must be public but token-protected. Never put the webhook token in browser code.

Saved product tokens are only read by Convex functions and the Next.js publish route. Client product queries return `hasAccessToken` instead of the token value.

Bearer auth protects the public Next route, but direct Convex mutations need their own server identity or secret check. If the receiver later needs stronger replay protection, add a timestamped HMAC header while keeping bearer auth for compatibility.

Implementation references: [Convex function authentication](https://docs.convex.dev/auth/functions-auth), [Convex transactional mutations](https://docs.convex.dev/functions/mutation-functions), [R2 authentication](https://developers.cloudflare.com/r2/api/tokens/), [R2 presigned URLs](https://developers.cloudflare.com/r2/api/s3/presigned-urls/), [Next.js MDX compilation](https://nextjs.org/docs/app/guides/mdx), [rehype-sanitize](https://github.com/rehypejs/rehype-sanitize), and [OWASP SSRF prevention](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html).

## Relevant Code

- `src/features/workspace/components/BlogPublishButton.tsx`
- `src/features/workspace/components/BlogPublishingIntegrationPanel.tsx`
- `src/features/workspace/components/BlogPublishingSetupGuide.tsx`
- `src/features/workspace/components/BlogPublishingReceiverDetails.tsx`
- `src/features/workspace/utils/publishBlog.ts`
- `src/features/workspace/utils/buildBlogPublishingIntegrationPrompt.ts`
- `codex-skills/blogr-publishing-receiver/SKILL.md`
- `codex-skills/blogr-publishing-receiver/references/*`
- `codex-skills/blogr-publishing-receiver/assets/fixtures/*`
- `src/app/api/blogs/publish/route.ts`
- `src/app/api/blogs/publish/markPublishedBlogStatus.ts`
- `src/app/api/blogs/publish/schema.ts`
- `src/server/publishing/getBlogPublishEnvironmentDestination.ts`
- `src/server/publishing/buildBlogPublishTags.ts`
- `src/server/publishing/buildBlogPublishPayload.ts`
- `src/server/publishing/buildBlogPublishArticle.ts`
- `src/server/publishing/sendBlogPublishWebhook.ts`
- `convex/blogs/markBlogPublished.ts`
- `convex/products/updateBlogPublishingIntegration.ts`
- `convex/products/getBlogPublishingIntegration.ts`
- `convex/products/publishBlogWithIntegration.ts`

## File Tree

```text
src/app/api/blogs/publish/
src/server/publishing/
src/server/publishing/types/
src/features/workspace/components/BlogPublishingIntegrationPanel.tsx
src/features/workspace/components/BlogPublishingSetupGuide.tsx
src/features/workspace/constants/publishing/
src/features/workspace/components/BlogPublishButton.tsx
src/features/workspace/utils/publishBlog.ts
src/features/workspace/utils/buildBlogPublishingIntegrationPrompt.ts
src/features/workspace/types/integrations/
src/features/workspace/types/publishing/
convex/blogs/markBlogPublished.ts
convex/products/*BlogPublishing*
convex/products/publishBlogWithIntegration.ts
docs/blog-webhook-publishing.md
docs/blogr-publishing-receiver-skill.md
docs/blog-tags.md
docs/blog-published-status-filter.md
docs/target-app-blog-publishing-brief.md
```
