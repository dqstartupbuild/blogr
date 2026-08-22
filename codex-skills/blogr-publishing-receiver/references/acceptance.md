# Acceptance And Verification

## Fixture Assets

Use these fixtures from the skill:

```text
assets/fixtures/publish-articles.json
assets/fixtures/update-article.json
assets/fixtures/publish-articles-multimedia.json
```

Use them for route tests, Convex mutation tests, image rewrite tests, and renderer tests. Mock image downloads because the fixture image URLs are reserved for tests.

## Required Tests

Add focused tests for:

- missing bearer token returns `401`
- wrong bearer token returns `401`
- valid `publish_articles` payload creates posts
- publishing the same slug twice updates one post
- `update_article` matches the stable Blogr source ID before falling back to slug
- `update_article` refreshes content, SEO title, description, and `updated_at`
- `update_article` preserves the original `created_at`
- publishing and then updating leaves exactly one saved article
- top-level `image_url` is copied to R2 and rewritten
- markdown image URLs are copied to R2 and rewritten
- frontmatter `featureImage` is copied and rewritten when present
- saved content does not contain Blogr source image URLs
- MDX renderer strips frontmatter
- H1 through H6 render as headings with IDs
- table of contents includes H2 through H6, not H1
- multiline YouTube iframe renders as a safe embed
- sitemap/feed output includes webhook-published posts when the app has those outputs
- ingestion `--dry-run` writes no files and changes no database authority state
- an idempotent zero-diff prepare rerun is safe
- large, multi-page export failure leaves its batch non-active and all records database-served, then a resumable prepare only marks the batch prepared after every page succeeds
- a targeted prepare after an active batch creates an independent batch without changing the active batch
- multiple/concurrent prepared batches remain independent, and activating batch B leaves active batch A active
- wrong deployment URL, non-allowlisted/non-HTTPS origin, embedded credentials, redirect, off-origin response, manifest schema, source ID + repo path + SHA-256 tuple, or revision rejects activation with no authority transition
- activation uses one batch compare-and-set that rejects a non-prepared batch or changed schema/version or entry set/hash
- matching deployed manifest activates the exact prepared batch and its records
- mixed database/repo results dedupe by stable ID then slug across index, sitemap, feed, search, and static params
- rolling deployment or missing manifest artifact falls back to retained database content without duplicates
- a mixed webhook payload containing a preparing/prepared/active article and a new article returns `409` before all side effects, while a new-only payload publishes normally
- webhook ownership is checked before image downloads and again transactionally before final write; a rejected concurrent change deletes only that request's R2 objects or uses an explicit reservation
- rollback restores database authority while retaining repo files/records
- aborting a preparing/prepared batch detaches its records, restores database authority, marks it aborted, and retains generated files; aborting an active batch is rejected
- path traversal, invalid frontmatter, and managed/unmanaged path collisions are rejected

If the target app does not have an established test runner, document the gap and still add the most useful lightweight route/helper tests that fit the repo.

## Verification Commands

Run the target app's available commands, usually:

```bash
npm run lint
npx tsc --noEmit --pretty false
npm run build
```

Use the package manager and commands specified by the target repo instructions.

## Final Response

Include a **Required setup** section that names every required value and where it must be set:

- hosting/server env vars, including `BLOG_PUBLISH_WEBHOOK_TOKEN`, `CONVEX_URL` or `NEXT_PUBLIC_CONVEX_URL`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_ENDPOINT`, and `R2_BUCKET`
- `BLOG_REPO_DEPLOYMENT_ORIGIN` and `BLOG_REPO_INGEST_SECRET`, or the exact existing named admin/deploy mechanism, including where each is set (authorized local/CI and Convex/server environments for the secret)
- Convex setup, including project setup, schema deployment, and function deployment
- Cloudflare R2 setup, including bucket creation and S3-compatible access key creation
- Blogr Settings values: webhook URL, access token, and publisher label
- optional follow-ups, clearly labeled optional
- verification commands run and anything the user still needs to run after deployment

Do not finish with vague wording like "set the needed env vars." Name the variables.
