# Next.js App Router Implementation

Use the target repo's installed Next.js documentation and conventions first. The current official references are [Route Handlers](https://nextjs.org/docs/app/api-reference/file-conventions/route), [generateMetadata](https://nextjs.org/docs/app/api-reference/functions/generate-metadata), [sitemap files](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap), [revalidatePath](https://nextjs.org/docs/app/api-reference/functions/revalidatePath), and [revalidateTag](https://nextjs.org/docs/app/api-reference/functions/revalidateTag).

## Route Handler

Implement or repair `src/app/api/webhooks/blog-publisher/route.ts`. Keep the route as the orchestration boundary:

1. authenticate the bearer token
2. validate the complete envelope and enforce batch/image/byte limits
3. normalize all articles
4. preflight source identity, slug collision, and repo ownership for the whole request
5. download approved images with bounded concurrency and upload them to request-owned R2 keys
6. rewrite body/frontmatter/top-level image references to durable target-owned keys or routes
7. call one authorized Convex mutation that transactionally repeats ownership checks and writes the bounded article batch plus summaries
8. clean up only request-owned uploads after confirmed rejection; retain them while a timeout leaves commit status unknown
9. refresh affected cache entries
10. return success within Blogr's 15-second total deadline

Do not forward the request through another HTTP endpoint, Convex HTTP action, `http.ts`, or `.convex.site`. Do not return `200` before durable R2 and database completion.

## Public Pages And Assets

Add or reuse `/blog` and `/blog/[slug]` only when required by the user. The index reads lightweight summary records. The article page uses an indexed slug lookup, controlled Markdown rendering, SEO title/description, canonical metadata, and the stable feature image route.

A non-empty `image_url` must populate the visible article feature image, not only an R2 record. Use its stable target-owned URL for article Open Graph, Twitter, and structured-data images too. Give visible images appropriate alt text and reserved dimensions/aspect ratio; preserve a deliberate image-free layout when absent. Do not invent descriptive alt text from facts unavailable to the receiver.

Build article metadata from the canonical record: separate SEO title, description, absolute self-canonical, article-specific Open Graph/Twitter title and description, `og:type=article`, canonical article URL, and stable absolute image URL. Override inherited homepage social metadata and check file-based Open Graph/Twitter image conventions for unintended overrides. Supply consistent publication/modification dates and truthful BlogPosting JSON-LD, escaping `<` in serialized JSON before embedding it. Use an established author/publisher identity; the sender label is not an author. Do not fabricate people or credentials. Give the blog index its own metadata and canonical, and provide crawlable links to it from the existing site navigation.

For private R2 buckets, a route such as `/api/blog-assets/[...key]` may issue a fresh short-lived signed redirect or stream an approved published asset. Validate the key against stored published article references. Never accept an arbitrary bucket key and never persist the resulting presigned URL.

Keep signed redirects uncached or strictly shorter-lived than the signature. Track commit and cache-refresh results separately so a refresh error cannot delete an article's already-committed images.

## Discovery And Cache

Include published articles in the outputs that the target actually has: blog index, article metadata, sitemap, feed, static params, search, tags, and related posts. Use summary records rather than canonical MDX documents.

Sitemaps must include the blog index and published canonical articles. Choose explicit request-time freshness or a tested cache/revalidation policy for metadata routes; merely calling a database SDK does not prove a sitemap is dynamic. Do not use generation time as a static page's last-modified date. Use real modification dates or omit them.

Return a valid RSS feed with required channel title, link, and description; stable item IDs; original publication dates; and canonical item links. Expose feed autodiscovery. If the target maintains `llms.txt`, preserve its existing guidance and add blog/feed links and, when desired, a bounded current article listing using the same summary source. This is optional agent discovery, not a Google ranking requirement. Do not add search, taxonomy, or related-post features solely to satisfy a checklist when the target has none.

Distinguish missing content from backend failure: a failed article query must not become a cached 404, and a failed summary query must not become a successful empty sitemap/index/feed. Use safe diagnostics without logging secrets, and surface an appropriate server failure while preserving established verified repo fallbacks.

After create or update, invalidate the affected article and shared discovery data using the target's established cache strategy. Apply `revalidatePath` or `revalidateTag` according to the installed Next version and existing cache ownership. In Next 16.2.9, the one-argument `revalidateTag(tag)` form is deprecated; an external webhook that requires immediate expiration can use `revalidateTag(tag, { expire: 0 })`, while `revalidateTag(tag, "max")` uses stale-while-revalidate.

When a slug changes, invalidate both the previous and new article paths and remove stale discovery entries using the mutation's previous/current slug result.

When optional repo ingestion is requested, follow [repo-ingestion.md](repo-ingestion.md) for repo/database merging and activation rules. Do not duplicate that protocol here.

## Environment And Setup

Preserve existing env names. Typical server values are:

```bash
BLOG_PUBLISH_WEBHOOK_TOKEN=<shared-blogr-token>
BLOG_PUBLISH_CONVEX_SECRET=<server-to-convex-secret-if-no-existing-auth>
CONVEX_URL=https://your-deployment.convex.cloud
# or an existing NEXT_PUBLIC_CONVEX_URL
R2_ACCESS_KEY_ID=<access-key-id>
R2_SECRET_ACCESS_KEY=<secret-access-key>
R2_ENDPOINT=<account-r2-endpoint>
R2_BUCKET=<bucket-name>
```

An existing `R2_BUCKET_NAME` or equivalent is valid. Add repo-ingestion values only when that optional capability is requested.

Inspect the target's deployment state before giving commands. Explain code generation, development function pushes, and production deployment separately. Never deploy, commit, or push unless the user explicitly asks.
