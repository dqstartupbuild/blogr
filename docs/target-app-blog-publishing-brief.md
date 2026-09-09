# Target App Blog Publishing Brief

Copy the in-app integration prompt into the coding agent working in the target app. The prompt tells that agent to download the complete [`$blogr-publishing-receiver` skill folder](https://github.com/dqstartupbuild/blogr/tree/main/codex-skills/blogr-publishing-receiver), install it in the agent's supported skills directory, read `SKILL.md`, and use the skill. If skill access or installation is unavailable, the copied fallback prompt contains the same essential contract so work can continue.

The supported reference stack is Next.js App Router, Convex article and summary records, and Cloudflare R2 images. The full setup brief includes deployment-safe repo ingestion; narrower repair tasks add it only when the user asks to move published database articles into checked-in content.

## Receiver Outcome

The target app should provide:

- `POST /api/webhooks/blog-publisher` with bearer authentication
- complete `event_type`, `timestamp`, and `data` validation
- a bounded 15-second durable publication flow
- target-owned R2 images referenced by object key or stable serving URL
- one authorized, atomic Convex mutation for final ownership checks and article/summary writes
- source-ID-first upserts with legacy slug fallback and explicit collision rejection
- controlled Markdown rendering that never evaluates received MDX as JavaScript
- public blog/discovery/cache behavior only where the target app needs it
- focused failure-path tests and exact setup instructions

The Next route token is not enough to secure direct Convex calls. Every callable publishing or ingestion function must verify an existing server identity or a dedicated server-to-Convex secret.

The identity must have publishing/admin permission for the target site. Shared secrets are validated arguments, not JWTs passed to `setAuth`, and missing configuration must fail closed.

## Skill Source

The repo-owned skill can be downloaded from [GitHub](https://github.com/dqstartupbuild/blogr/tree/main/codex-skills/blogr-publishing-receiver). Keep the full folder together when installing it:

```text
codex-skills/blogr-publishing-receiver/
  SKILL.md
  agents/openai.yaml
  references/
    contract.md
    convex.md
    r2.md
    next-app-router.md
    mdx-rendering.md
    repo-ingestion.md
    acceptance.md
  assets/fixtures/
    publish-articles.json
    update-article.json
    publish-articles-multimedia.json
```

The entrypoint routes tasks to only the needed references. Repo ingestion is not part of a repair-only or renderer-only task unless the user asks for it.

## Important Contract Details

Blogr sends `publish_articles` with `data.articles` and `update_article` with `data.article`. The sender also includes `timestamp`. Current article validators include `content_html`, but the receiver must use the controlled Markdown path rather than trusting that HTML.

Blogr waits 15 seconds for the full response. The receiver must bound batch size, image count, media concurrency, per-image bytes, and timeouts. It returns success only after images and database records are durable.

Stable source ID wins. Slug fallback is limited to legacy rows without an established source ID. A slug owned by another source ID returns `409` instead of overwriting unrelated content.

Check requested slug ownership even when the source-ID lookup succeeds, including a separate legacy row. Reject duplicate IDs/slugs within one batch. After a confirmed transaction rejection, clean up only request-owned images. A timeout does not prove rollback: retain images until reconciliation resolves the commit outcome, and never delete them for a later cache-refresh error.

R2 credentials are created through Cloudflare's API-token interface, but runtime env names may be access key ID/secret, endpoint, and the target's existing bucket name. Persist object keys or stable same-origin routes, not expiring presigned URLs.

An empty `image_url` means there is no feature image. Skip its download while still copying body/frontmatter images; reject malformed non-empty URLs.

Remote images are SSRF input. Use a trusted-host allowlist or validated public-address egress, revalidate redirects, reject private/special-use IP ranges and URL credentials, enforce byte limits while streaming, verify that the declared raster MIME type matches the recognized bytes, and reject SVG by default. Blogr normalizes its source object MIME type before publication; receivers still reject any mismatch they receive.

Bind connections to validated addresses or a trusted egress layer to prevent DNS rebinding. Do not cache signed asset redirects beyond their expiry. If incoming source media is already expired, obtain fresh media or republish instead of storing a broken reference.

## Optional Repo Ingestion

The optional workflow provides prepare, dry-run, activate, abort, and rollback commands. Preparation creates deterministic MDX, exact SHA-256 revisions, and independent batches. Activation verifies a static manifest built from the deployed checked-in bytes at the configured HTTPS origin. It never accepts local files as deployment proof or deactivates unrelated active batches.

Claim exported pages transactionally against their database revisions, then recheck the complete claim set before preparation completes. Runtime content and the manifest use the same exact artifact. Activation and rollback invalidate cached authority and discovery decisions.

Database fallback remains available until an exact active deployed artifact exists. A direct edit changes the hash, so committing it alone does not activate the new revision. The supported change cycle is rollback or abort, republish through Blogr, prepare, deploy, then activate.

## Setup After Receiver Deployment

In Blogr Settings, enter:

- Webhook URL: `https://target-app-domain.com/api/webhooks/blog-publisher`
- Access token: the value stored by the target as `BLOG_PUBLISH_WEBHOOK_TOKEN`
- Publisher label: `Blogr` or the desired sending-app label

The publisher label becomes `source`; it is not the article author.

## Sources

See [Convex function authentication](https://docs.convex.dev/auth/functions-auth), [Convex transactional mutations](https://docs.convex.dev/functions/mutation-functions), [Cloudflare R2 authentication](https://developers.cloudflare.com/r2/api/tokens/), [R2 presigned URLs](https://developers.cloudflare.com/r2/api/s3/presigned-urls/), [Next.js MDX compilation](https://nextjs.org/docs/app/guides/mdx), and [OWASP SSRF prevention](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html).
