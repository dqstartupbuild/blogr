# Next.js App Router Implementation

## Route Handler

Implement the webhook in:

```text
src/app/api/webhooks/blog-publisher/route.ts
```

The route owns the full publishing flow:

1. Validate `Authorization: Bearer <token>`.
2. Parse and validate the JSON payload.
3. Normalize every article from `publish_articles` or `update_article`.
4. Preflight ownership for the entire payload before image downloads or any other side effect; reject the whole request if any article is protected by an ingestion batch.
5. Copy every required image to R2.
6. Rewrite article image URLs before saving.
7. Recheck ownership transactionally before final writes; clean up only request-owned R2 objects on a rejected concurrent change, or use a reservation.
8. Upsert Convex records with `ConvexHttpClient`.
9. Refresh cached blog routes and discovery outputs.
10. Return `{ "message": "Published." }`.

Do not forward this request to another route, a Convex HTTP action, a Convex HTTP route, or `.convex.site`.

## Public Blog Pages

Add or reuse:

- `/blog`
- `/blog/[slug]`

The index page should read lightweight summary records only. It should not load full MDX bodies, image arrays, or large metadata.

The article page should fetch by indexed slug and render the full article body. It should include metadata from `seo_title`, `meta_description`, canonical URL data, and the stored feature image when present.

## Deployment-Safe Repo Ingestion

Provide an explicit user-run command with two logical phases:

```bash
npm run blogr:ingest
npm run blogr:ingest -- --activate --batch=<batchId> --deployment-url=https://your-site.example
npm run blogr:ingest -- --abort --batch=<batchId>
```

The prepare phase exports published database articles to deterministic, checked-in MDX paths and prints/persists a batch ID. It supports `--dry-run`, all published articles by default, and targeted stable IDs/slugs. It must paginate, preserve SEO/frontmatter and target-owned R2 URLs, reject unsafe paths/frontmatter and collisions, use temporary staging plus atomic rename, and avoid volatile serialization values such as export timestamps. Do not export binary media. Never overwrite unmanaged files, prune files, commit, push, or deploy. Track independent ingestion batches (batch ID, schema version, entry set/hash, status preparing/prepared/active/rolled_back/aborted); only mark a batch prepared after every page succeeds. A source ID or slug cannot belong to more than one non-rolled-back/non-aborted batch.

After the files are committed and deployed, activation must require `--batch=<batchId>` and fetch that batch's schema-versioned manifest route from `--deployment-url`. Generate manifests statically at build time from the exact checked-in MDX bytes, never from database or other dynamic data, and key entries by batch ID. Verify every tuple and the selected batch entry set/hash before changing authority. Accept only `BLOG_REPO_DEPLOYMENT_ORIGIN`, a configured canonical/allowlisted HTTPS deployment origin without embedded credentials, reject redirects, and reject an off-origin response. The database transition is one compare-and-set of the selected prepared batch record to active when schema/version and entry set/hash match; activating a later batch must not deactivate existing active batches. Do not treat files on the local machine as deployment proof. An optional CI job may run activation after a successful deploy using server-only credentials.

Protect activation credentials as non-committed, server-only environment/admin/deploy values. Require `BLOG_REPO_INGEST_SECRET`, a long random value in authorized local/CI and Convex/server environments, unless an equivalent named admin/deploy mechanism already exists. Do not expose public unauthenticated state-changing endpoints, pass secrets in command arguments, browser code, or logs.

Keep public rendering deployment-safe. Render from the repo only when the exact deployed manifest artifact/revision matches the database record's active batch; otherwise render its retained database content. Merge all active batches with database fallback. This includes first deploys, rolling deployments, failed deploys, and rollbacks. `--abort --batch=<batchId>` only accepts preparing/prepared batches, detaches records to restore database authority, marks the batch aborted, and retains generated files for explicit cleanup. Revalidate affected routes after activation, abort, or rollback.

## SEO And Discovery

Webhook-published and repo-ingested posts must participate in the target app's discovery outputs:

- blog index
- article metadata
- sitemap `lastmod`
- RSS/feed when the app has one
- static params when the app uses static generation
- search, related posts, and tag/filter views when they exist

Use summary records or selected fields for sitemap, feed, search, related posts, static params, and filters. Avoid loading every full article to build these views.

Merge deployed repo-manifest summaries with database summaries before generating every discovery output. Deduplicate stable source ID first and slug second. Omit a database summary only when the exact matching deployed repo artifact exists; otherwise keep it as the fallback.

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
BLOG_REPO_DEPLOYMENT_ORIGIN=https://your-production-site.example
BLOG_REPO_INGEST_SECRET=<long-random-secret>
```

Do not add `CONVEX_SITE_URL`, `NEXT_PUBLIC_CONVEX_SITE_URL`, `R2_TOKEN`, or `R2_PUBLIC_URL` for this integration.
