# Next.js App Router Implementation

## Route Handler

Implement the webhook in:

```text
src/app/api/webhooks/blog-publisher/route.ts
```

The route owns the full publishing flow:

1. Validate `Authorization: Bearer <token>`.
2. Parse and validate the JSON payload.
3. Normalize articles from `publish_articles` or `update_article`.
4. Copy every required image to R2.
5. Rewrite article image URLs before saving.
6. Upsert Convex records with `ConvexHttpClient`.
7. Refresh cached blog routes and discovery outputs.
8. Return `{ "message": "Published." }`.

Do not forward this request to another route, a Convex HTTP action, a Convex HTTP route, or `.convex.site`.

## Public Blog Pages

Add or reuse:

- `/blog`
- `/blog/[slug]`

The index page should read lightweight summary records only. It should not load full MDX bodies, image arrays, or large metadata.

The article page should fetch by indexed slug and render the full article body. It should include metadata from `seo_title`, `meta_description`, canonical URL data, and the stored feature image when present.

## SEO And Discovery

Webhook-published posts must participate in the target app's discovery outputs:

- blog index
- article metadata
- sitemap `lastmod`
- RSS/feed when the app has one
- static params when the app uses static generation
- search, related posts, and tag/filter views when they exist

Use summary records or selected fields for sitemap, feed, search, related posts, static params, and filters. Avoid loading every full article to build these views.

## Cache Refresh

After a successful webhook publish, refresh cached routes and data used by:

- `/blog`
- `/blog/[slug]`
- sitemap
- feed
- related cached blog lists

Use the target app's established cache invalidation style. In App Router apps, `revalidatePath` or `revalidateTag` is usually appropriate.

## Env Vars

Server or hosting env vars:

```bash
BLOG_PUBLISH_WEBHOOK_TOKEN=replace-with-the-token-entered-in-blogr
CONVEX_URL=https://your-deployment.convex.cloud
# or NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
R2_ACCESS_KEY_ID=<access-key-id>
R2_SECRET_ACCESS_KEY=<secret-access-key>
R2_ENDPOINT=<account-r2-endpoint>
R2_BUCKET=<bucket-name>
```

Do not add `CONVEX_SITE_URL`, `NEXT_PUBLIC_CONVEX_SITE_URL`, `R2_TOKEN`, or `R2_PUBLIC_URL` for this integration.
