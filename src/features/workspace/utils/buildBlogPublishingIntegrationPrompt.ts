import { blogPublishingPayloadExample } from "../constants/publishing/blogPublishingPayloadExample";
import { blogPublishingReceiverEndpoint } from "../constants/publishing/blogPublishingReceiverEndpoint";
import { blogPublishingReceiverEnvVar } from "../constants/publishing/blogPublishingReceiverEnvVar";
import { blogPublishingReceiverSkillUrl } from "../constants/publishing/blogPublishingReceiverSkillUrl";

export const buildBlogPublishingIntegrationPrompt = (productName: string) => {
  const productLabel = productName.trim() || "this product";

  return `Before changing the target app, download the complete Blogr publishing receiver skill folder from:
${blogPublishingReceiverSkillUrl}

Install or copy that folder into your coding agent's supported skills directory, read its SKILL.md entrypoint, and use $blogr-publishing-receiver for this task. Keep the downloaded references and fixtures with SKILL.md. If the agent cannot access or install skills, continue with the complete fallback brief below instead of stopping.

Build a Blogr publishing receiver for ${productLabel} in this Next.js App Router app. Use Convex for article and summary records and Cloudflare R2 for copied article images. Preserve this app's existing structure, environment names, auth, and storage helpers.

Blogr sends finished posts to:

POST ${blogPublishingReceiverEndpoint}

Auth:
- Require Authorization: Bearer <token>.
- Compare it to the server-only env var ${blogPublishingReceiverEnvVar}.
- Return 401 with { "error": "Invalid access token." } when it is missing or wrong.
- Also authorize every externally callable Convex publishing or ingestion function. Reuse an existing server identity/JWT, or add a dedicated server-to-Convex secret such as BLOG_PUBLISH_CONVEX_SECRET in both hosting and Convex environments. Next route auth alone does not prevent a direct Convex call.
- Check publishing/admin permission for the target site, not just a non-null identity. setAuth expects an identity JWT. Pass an alternative shared secret as a validated server-only function argument, require a non-empty expected secret, and fail closed when configuration is absent.

Expected payload:
${blogPublishingPayloadExample}

Contract:
- Validate event_type, timestamp, data, and every article. publish_articles uses a non-empty data.articles array; update_article uses data.article.
- The sender requires content_html for compatibility, but content_mdx is the body source of truth with content_markdown fallback. Never use content_html as an unsanitized rendering shortcut.
- Blogr allows 15 seconds for the complete webhook response. Bound article count, image count, bytes, media concurrency, per-download timeouts, and total work. Reject over-limit batches before side effects.
- Return 200 with { "message": "Published." } only after images and database records are durable. Do not acknowledge early unless the sender contract is deliberately changed for durable asynchronous receipt.
- Match stable Blogr id first. Fall back to slug only for a legacy record without a source ID. If the slug belongs to a different established source ID, reject the whole request with 409 and overwrite nothing.
- Reject duplicate IDs/slugs within the incoming batch. Check the requested slug even when the ID lookup succeeds; never merge with a separate canonical row, including a legacy row, silently.
- Preserve the original created_at on update_article. Refresh visible title, separate seo_title, meta_description, body, images, tags, source, updated_at, summaries, and caches.
- Treat source as the sending-app label, not the article author.

Route and Convex:
- Keep the full orchestration in src/app/api/webhooks/blog-publisher/route.ts. Do not forward to another route, Convex HTTP action, http.ts, .convex.site, or a proxy.
- Use a request-scoped ConvexHttpClient with CONVEX_URL or an existing NEXT_PUBLIC_CONVEX_URL on .convex.cloud, or the target's established convex/nextjs server helper.
- ConvexHttpClient cannot directly call internalMutation. Use an authenticated callable mutation whose boundary check runs before protected work.
- Before any side effect, preflight the complete request by source ID, legacy slug, and repo ownership.
- Upload R2 images outside the database transaction. Then call one bounded Convex mutation that repeats every ownership/collision check and atomically writes all accepted canonical articles plus summary/read-model rows.
- After a confirmed mutation rejection, clean up only R2 objects proven to have been created by this request. If a timeout or lost response leaves commit status unknown, retain uploads until an authorized operation/reservation check proves they are unused. A cache-refresh failure after commit must never trigger image deletion. Track failed cleanup for reconciliation; never delete shared or pre-existing objects.
- If any article belongs to a preparing, prepared, or active repo batch, reject the entire request before side effects. Use an accurate message such as: Article <sourceId> is attached to repo batch <batchId> (<status>). Abort or roll back that batch as allowed, republish through Blogr, then prepare, deploy, and activate a new revision.
- Set and test a maximum accepted batch size so the article and summary writes fit one transaction.
- Public queries expose published data only. Lists and discovery outputs read lightweight summary records directly; selecting fields after loading a full article does not make the database read lightweight.
- Use indexed source ID and slug lookups and cursor pagination where results can grow.

R2:
- Copy image_url, Markdown images in both body fields, and frontmatter featureImage before saving. Rewrite every stored reference to a target-owned object key or stable serving URL.
- An empty image_url is valid when Blogr has no feature image: skip that download and save no feature image, while processing body/frontmatter images normally. Reject non-empty malformed URLs.
- Preserve existing env names. Typical S3-compatible values are R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_ENDPOINT, and R2_BUCKET; an existing R2_BUCKET_NAME or equivalent does not need renaming.
- Cloudflare creates the S3 key pair through its R2 API-token interface. A runtime env var named R2_TOKEN is not required unless this app already uses one for another purpose.
- Do not require a public bucket, custom domain, or R2_PUBLIC_URL.
- Never persist an expiring presigned URL as the article's durable value. For a private bucket, save the key and use a stable same-origin route that creates a fresh signed redirect or streams only objects referenced by published articles. Do not expose an arbitrary bucket browser.
- Do not cache a signed redirect beyond its signature lifetime; prefer no-store. Repair expired stored target links from verified owned keys. If source media expired before copying, request fresh media or republishing instead of saving a broken link.
- Treat remote URLs as SSRF input. Prefer a trusted hostname allowlist. Otherwise validate public IPv4/IPv6 destinations, reject credentials, private/loopback/link-local/reserved targets and unsafe ports, disable redirects or revalidate every bounded redirect, enforce byte limits while streaming, and compare the declared MIME type with the raster signature in the downloaded bytes. Accept only matching PNG, JPEG, GIF, and RIFF/WEBP signatures; reject malformed or truncated signatures and MIME mismatches. Reject SVG unless a dedicated sanitizer and serving policy is requested. Blogr normalizes its own stored source images from recognized bytes before publication, but this does not weaken the receiver's mismatch rejection.
- Return a safe, actionable 422 JSON error for an image format mismatch before any article write; do not expose signed URLs or storage credentials in the response. Test this error and cleanup of earlier request-owned uploads.
- Bind the actual connection to the validated address with original TLS/SNI hostname, or use trusted egress enforcement. A DNS check followed by an unrestricted second lookup does not prevent rebinding.

Rendering and Next.js:
- Treat content_mdx, content_markdown, content_html, and exported repo files as untrusted.
- Do not compile received MDX as JavaScript. Reject or neutralize imports, exports, JSX expressions, arbitrary components, scripts, handlers, dangerous URLs, and unapproved raw HTML.
- Parse the supported Markdown subset with an explicit component map and sanitize approved HTML.
- Support frontmatter as data, H1-H6, links, lists, blockquotes, tables, code, rewritten images, stable unique heading IDs, and a H2-H6 table of contents.
- Transform Blogr YouTube iframes/links only after exact https hostname, path, port, and video-ID validation. Do not accept suffix lookalikes such as youtube.com.attacker.example.
- Add or reuse /blog and /blog/[slug] only when needed. Use seo_title and meta_description for metadata.
- Include articles in the target's existing sitemap, feed, static params, search, tag, related-post, and cache flows. Use revalidatePath or revalidateTag according to this installed Next version.
- If a slug changes, invalidate both old and new article paths and remove stale discovery entries.

Deployment-safe repo ingestion:
- Include this optional capability for a full receiver setup, but do not add it during a narrower repair unless asked.
- Prepare with npm run blogr:ingest, persist and print its batch ID, and support --dry-run plus explicit stable-ID/slug targets.
- Track independent schema-versioned preparing | prepared | active | rolled_back | aborted batches with deterministic ordered entry sets/hashes. Articles and summaries reference batch ID, safe path, and the SHA-256 of exact file bytes. A source ID or slug cannot belong to multiple non-terminal batches.
- Prepare through authenticated cursor pagination. Validate deterministic frontmatter, paths, case-folding/managed collisions, exact bytes, and the complete entry set. Stage writes and only mark prepared after every page and file succeeds. Partial work remains database-served and resumable. Never export binary media, overwrite unmanaged files, prune, commit, push, deploy, or delete retained database content.
- Claim each exported page in an authorized mutation that compares its database revisions with current records and attaches article/summary ownership to the preparing batch atomically. Reject or re-export changed records. Require all write paths to respect claims, then recheck every claimed revision and the full entry set at prepare completion; pagination alone is not a snapshot.
- After deployment, activate only with npm run blogr:ingest -- --activate --batch=<batchId> --deployment-url=https://your-site.example.
- Build the schema-versioned manifest statically from exact checked-in bytes, never database/dynamic data. Key it by batch and include source ID, slug, path, SHA-256, and entry-set hash.
- Fetch only a fixed manifest path under BLOG_REPO_DEPLOYMENT_ORIGIN, a configured canonical/allowlisted HTTPS origin without credentials. Reject redirects and off-origin responses. Local files or a commit are not deployment proof.
- Activation is one authorized compare-and-set of the selected unchanged prepared batch. Activating one batch must not deactivate other active batches.
- Build the manifest and runtime content from the same exact artifact; invalidate cached article, discovery, and batch-authority reads after activation and rollback.
- Use BLOG_REPO_INGEST_SECRET in authorized local/CI and Convex/server environments unless an existing admin/deploy identity is reused. Never pass it in argv, browser code, or logs.
- Resolve repo content only for an active exact deployed artifact. Otherwise retain database fallback. Merge all active manifest summaries with database summaries and dedupe by source ID, then slug.
- Abort only preparing/prepared batches; rollback only active batches. Retain database records and generated files.
- A direct repo edit changes the SHA-256 and falls back to the database; committing alone does not activate that edit. The supported revision cycle is abort/rollback, republish through Blogr, prepare, deploy, then activate a new batch.

Tests:
- Cover route and direct-Convex auth, envelope arms, limits/deadline, duplicate batch IDs/slugs, stable ID/legacy slug behavior, requested-slug collision even with an ID match, preserved created_at, refreshed content/SEO/summaries, atomic mixed-batch rejection, confirmed rejection cleanup, committed-but-lost responses, cache-refresh failure, R2 rewrite/durability/expired links, SSRF redirects/IP ranges/DNS rebinding/streaming limits/MIME/SVG, untrusted MDX, YouTube lookalikes, and discovery/cache behavior.
- When repo ingestion is included, also cover dry-run, resumable multi-page failure, stale export revision rejection, zero-diff rerun, path/collision safety, independent batches, exact manifest/origin proof, compare-and-set activation, cache invalidation, fallback/dedupe, abort, rollback, and direct-edit revision mismatch.
- Run the target repo's focused tests, lint, typecheck, and build.

Required setup handoff:
- Name every value and location: ${blogPublishingReceiverEnvVar}; CONVEX_URL or existing NEXT_PUBLIC_CONVEX_URL; the existing Convex server identity or BLOG_PUBLISH_CONVEX_SECRET; R2 access key ID, secret, endpoint, and existing bucket env name; plus any canonical site URL.
- If repo ingestion was added, include BLOG_REPO_DEPLOYMENT_ORIGIN and the existing admin identity or BLOG_REPO_INGEST_SECRET in authorized local/CI and Convex/server environments.
- Include Convex code generation, development push, and production deployment as separate steps based on the target's real deployment state. Do not claim a production deployment without one.
- Include R2 bucket and S3-compatible access-key setup.
- Include Blogr Settings: webhook URL, matching access token, and publisher label. Explain that publisher label becomes source, not author.
- List commands run and post-deploy verification still needed.

Authoritative implementation references:
- Convex App Router: https://docs.convex.dev/client/nextjs/app-router/server-rendering
- Convex mutations: https://docs.convex.dev/functions/mutation-functions
- Convex auth: https://docs.convex.dev/auth/functions-auth
- Convex indexes and pagination: https://docs.convex.dev/database/reading-data/indexes/ and https://docs.convex.dev/database/pagination
- Cloudflare R2 credentials and AWS SDK v3: https://developers.cloudflare.com/r2/api/tokens/ and https://developers.cloudflare.com/r2/examples/aws/aws-sdk-js-v3/
- Cloudflare R2 presigned URLs: https://developers.cloudflare.com/r2/api/s3/presigned-urls/
- Next.js Route Handlers, MDX, and revalidation: https://nextjs.org/docs/app/api-reference/file-conventions/route, https://nextjs.org/docs/app/guides/mdx, and https://nextjs.org/docs/app/api-reference/functions/revalidatePath
- Controlled Markdown and HTML sanitization: https://github.com/remarkjs/react-markdown and https://github.com/rehypejs/rehype-sanitize
- OWASP SSRF prevention: https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html`;
};
