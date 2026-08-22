import { blogPublishingPayloadExample } from "../constants/publishing/blogPublishingPayloadExample";
import { blogPublishingReceiverEndpoint } from "../constants/publishing/blogPublishingReceiverEndpoint";
import { blogPublishingReceiverEnvVar } from "../constants/publishing/blogPublishingReceiverEnvVar";

export const buildBlogPublishingCodexPrompt = (productName: string) => {
  const productLabel = productName.trim() || "this product";

  return `Use $blogr-publishing-receiver if that Codex skill is installed. If the skill is not installed, keep going and follow this brief.

Build a Blogr publishing receiver for ${productLabel} in this Next.js App Router app. For this setup, use Convex for article records and Cloudflare R2 for copied article images.

Blogr sends finished posts when I click Publish. Add a public, token-protected webhook endpoint at:

POST ${blogPublishingReceiverEndpoint}

Auth:
- Read the Authorization header.
- Require Bearer <token>.
- Compare the token to the server-only env var below.
- Return 401 with { "error": "Invalid access token." } when the token is missing or wrong.

Required webhook token env var:
${blogPublishingReceiverEnvVar}

Expected payload:
${blogPublishingPayloadExample}

Implementation brief:
- Implement the route in src/app/api/webhooks/blog-publisher/route.ts.
- The route must own the full flow: validate the token, parse the payload, copy images to R2, rewrite article image URLs, upsert Convex records, refresh cached blog pages, and return JSON.
- Handle event_type "publish_articles" by saving every item in data.articles.
- Support event_type "update_article" with data.article.
- Match an existing post by the stable Blogr article id first, then by slug for older records.
- Publishing the same blog again must update the existing canonical article and every related summary/read-model record without creating a duplicate.
- Store content_mdx as the source of truth, falling back to content_markdown.
- Save title, seo_title, meta_description, body, images, tags, source, created_at, and updated_at from the payload when creating an article.
- On update_article, preserve the existing article's original created_at and replace updated_at with the latest payload value.
- Store seo_title separately from the visible article title.
- Copy image_url, markdown image URLs, and any frontmatter featureImage URL into Cloudflare R2 before saving. Rewrite saved body/image fields to target-owned URLs or keys.
- Use safe image fetching: http/https only, timeout, image content-type check, and a reasonable file-size limit.
- Do not hotlink Blogr image URLs.
- Use ConvexHttpClient from the route with CONVEX_URL or NEXT_PUBLIC_CONVEX_URL on .convex.cloud.
- Do not forward to Convex HTTP actions, Convex http.ts, .convex.site, or another proxy route.
- Do not add CONVEX_SITE_URL or NEXT_PUBLIC_CONVEX_SITE_URL for this integration.
- Do not use runtime mutable/serverless local storage for production articles or media. The only allowed checked-in content is deterministic MDX exported by the explicit user-run ingestion command below and then committed and deployed. Keep images in R2 unless explicitly asked otherwise.
- Do not require R2_TOKEN, R2_PUBLIC_URL, a public bucket, whole-bucket public access, or an R2 custom domain.
- Add lightweight Convex summary/read-model records for blog lists, sitemap/feed metadata, search/filter data, and static params. Do not load full article bodies for discovery views.
- Add or reuse /blog and /blog/[slug] pages.
- Render Blogr MDX safely: strip frontmatter, support headings, links, lists, blockquotes, tables, code, markdown images, H2-H6 table of contents, stable heading IDs, and whitelisted YouTube embeds including multiline iframe blocks.
- Include webhook-published posts in metadata, sitemap, feed if present, and cached blog data. Revalidate or refresh relevant routes after publish.
- Revalidate the article page, blog index, sitemap, and feed after both creates and updates.
- Add a deployment-safe repo ingestion workflow for published database-backed blogs. Prepare with npm run blogr:ingest, which persists and prints a batch ID. After commit/deploy, activate only that batch with npm run blogr:ingest -- --activate --batch=<batchId> --deployment-url=https://your-site.example. Support --dry-run, targeted stable IDs/slugs, all published posts, --abort --batch=<batchId> for preparing/prepared batches, and rollback for active batches. Never commit, push, deploy, prune, or overwrite unmanaged files automatically.
- Model authority with independent ingestion-batch/manifest database records: batch ID, schema version, entry-set/hash, and status preparing | prepared | active | rolled_back | aborted. Articles and summaries reference their batch ID, repo path, and SHA-256 revision; database/repo_pending/repo authority is derived from the referenced batch status. A source ID or slug cannot belong to more than one non-rolled-back/non-aborted batch. Prepare may attach resumable pages to a batch, but only marks the batch prepared after every page succeeds.
- Prepare must paginate published database records, validate deterministic MDX and frontmatter/path safety, check collisions, write through a temporary staging directory with an atomic rename, and attach the exact records to the preparing batch only after each safe page. Keep preparing/prepared content database-served. Serialize deterministically with no volatile timestamps, preserve SEO/frontmatter and target-owned R2 URLs, migrate no binary media, and use optimistic database revisions. A partial failure must exit nonzero with no authority transition; an idempotent zero-diff rerun must be safe.
- Activation must fetch and verify a deployed, schema-versioned repo manifest endpoint built statically from the exact checked-in MDX bytes, never database/dynamic data. Key manifest entries by batch ID and validate each source ID + repo path + SHA-256 tuple and that batch's entry-set/hash. Require BLOG_REPO_DEPLOYMENT_ORIGIN as the configured canonical/allowlisted HTTPS origin with no embedded credentials; reject redirects and off-origin responses. Local files alone are never proof of deployment. Only after a matching manifest is verified may activation atomically compare-and-set the selected prepared batch record to active; activating one batch must not deactivate any other active batch. Reject a wrong deployment URL or revision and leave database authority intact. Require BLOG_REPO_INGEST_SECRET, a long random non-committed secret in authorized local/CI and Convex/server environments, unless an equivalent named admin/deploy mechanism exists. Never put it in argv, browser code, logs, or public mutations. Document optional CI post-deploy activation.
- Resolve public articles repo-first only when their referenced batch is active and the exact deployed repo artifact/revision is present; otherwise fall back to retained DB content, including rolling deploy/rollback. Lists, sitemap, feeds, search, and static params must merge summaries from all active batch manifests plus DB summaries and dedupe stable ID then slug, excluding DB copy only when matching artifact exists.
- Before any side effects, preflight the entire webhook payload by stable ID then slug ownership. If any record is attached to a preparing/prepared/active batch, reject the whole request with HTTP 409 and a plain message: edit and commit the repo content, or roll back to database authority and republish before preparing again. After request-owned R2 uploads, repeat ownership validation transactionally before final writes; if it fails, delete only objects created by that rejected request (or use an explicit reservation). New DB articles must still publish normally. Abort detaches preparing/prepared batch records, restores DB authority, marks the batch aborted, and retains generated files for explicit cleanup. Rollback flips only the selected active batch to rolled_back and retains repo files.
- Keep ingestion and activation credentials server-only. Do not add public unauthenticated mutations, put secrets in command arguments, or write them to logs.
- Keep the token server-only. Do not expose it in browser code.
- Return 200 with { "message": "Published." } after a successful publish.
- Add focused docs for the webhook, env vars, file tree, and testing.
- Add tests for bearer auth, payload validation, stable-id and slug upserts, update_article content and SEO updates, preserved created_at, refreshed updated_at, exactly one saved article after republishing, R2 image copy/rewrite, MDX rendering, YouTube embeds, sitemap/feed inclusion, ingestion dry runs, zero-diff reruns, multi-page partial export failure, pre-activation failures, targeted prepare after an active batch, multiple/concurrent prepared batches, wrong deployment rejection, batch activation compare-and-set, matching deployment activation without deactivating other batches, mixed-source dedupe, rolling-deploy/database fallback, protected webhook 409/no side effects, new articles, request-owned R2 cleanup after a concurrent final ownership failure, abort, rollback, collisions, and path traversal.
- Run lint, typecheck, and build before finishing.

Final response requirements:
- Include a clear Required setup section.
- Name every hosting/server env var: BLOG_PUBLISH_WEBHOOK_TOKEN, CONVEX_URL or NEXT_PUBLIC_CONVEX_URL, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_ENDPOINT, R2_BUCKET, BLOG_REPO_DEPLOYMENT_ORIGIN, and BLOG_REPO_INGEST_SECRET, plus any site URL the implementation needs. State where the ingestion secret is set, or name the exact equivalent existing admin/deploy mechanism.
- Include Convex setup and deployment steps.
- Include Cloudflare R2 bucket and S3-compatible access key steps.
- Include Blogr Settings values: webhook URL, access token, and publisher label. Explain that publisher label becomes the payload source value, not the article author.
- List verification commands you ran and anything still needed after deployment.
- Do not finish with vague wording like "set the needed env vars."`;
};
