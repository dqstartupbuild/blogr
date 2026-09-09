# Acceptance And Verification

## Fixtures

Use the skill fixtures:

- `assets/fixtures/publish-articles.json`
- `assets/fixtures/update-article.json`
- `assets/fixtures/publish-articles-multimedia.json`

Compare them with the current sender validators when the Blogr checkout is available; the installed skill's bundled contract supports target apps without that checkout. Mock reserved image hosts and assert saved records contain target-owned keys or stable serving URLs.

## Receiver Contract

Test the behavior affected by the task:

- missing or wrong bearer token returns `401`
- missing or wrong direct Convex authorization is rejected without reads or writes
- valid `publish_articles` and `update_article` envelopes include `timestamp` and the correct data arm
- unknown or mismatched event shapes and over-limit batches fail before side effects
- the complete request succeeds durably inside the 15-second sender deadline with bounded media concurrency
- the same source ID updates one article and keeps summaries synchronized
- slug fallback migrates a legacy row without a source ID
- a slug collision with a different established source ID returns `409` and overwrites nothing
- duplicate incoming IDs/slugs and an ID-matched article changing to another canonical row's slug fail before side effects
- `update_article` preserves the original `created_at` and refreshes body, SEO fields, images, tags, source, `updated_at`, summaries, and caches
- a mixed protected/new batch fails before side effects
- the final bounded mutation rechecks ownership and atomically writes canonical articles plus summaries
- a concurrent final-check failure removes only request-owned R2 objects
- a committed mutation with a lost response or failed cache refresh retains its images; unresolved commit status defers cleanup
- public queries cannot expose drafts, secrets, or administrative data
- list/discovery queries read lightweight summary records rather than loading canonical MDX documents

## R2 And SSRF

Test:

- top-level, Markdown, and frontmatter images are copied and rewritten
- an empty top-level `image_url` saves no feature image and does not block body/frontmatter image processing
- persisted values are object keys, stable same-origin asset routes, or explicitly permanent public URLs, not presigned URLs
- a stable private-asset route refreshes signatures or streams only keys referenced by published articles
- expired signed redirects are never reused from cache; expired source media fails clearly without saving broken references
- URL credentials, unsafe schemes/ports, private and special-use IPv4/IPv6 targets, DNS rebinding strategy failures, redirects, and off-allowlist hosts are rejected
- byte limits are enforced while streaming without relying on `Content-Length`
- known image-format failures return an actionable 422 JSON error without article writes or leaked signed URLs, and clean earlier request-owned uploads
- a JPEG response declared as `image/png` is rejected before storage, even though Blogr normalizes its own source images before publishing
- recognized PNG, JPEG, GIF, and RIFF/WEBP signatures with matching declared MIME types are accepted; malformed or truncated signatures, non-raster bytes, and SVG are rejected by default
- timeout, upload, rewrite, and final mutation failures do not delete shared objects

## Rendering

Test:

- frontmatter is parsed as data and not displayed
- H1 through H6 have stable unique IDs; the table of contents includes H2 through H6 only
- imports, exports, JSX expressions, arbitrary components, scripts, event handlers, and unsafe raw HTML never execute
- `content_html` is not used as an unsanitized shortcut
- multiline and legacy YouTube forms render only after exact host, path, scheme, port, and video-ID validation
- hostile lookalike YouTube hosts remain inert
- repo-exported content uses the same controlled renderer and is never imported as executable remote MDX

## Optional Repo Ingestion

When ingestion is in scope, test:

- `--dry-run` changes no files or database state
- multi-page failure leaves the batch non-active and resumable
- a webhook changing a record between export and ownership claim causes a revision conflict or safe re-export, never a stale prepared snapshot
- zero-diff prepare reruns are idempotent
- targeted, simultaneous prepared, and multiple active batches remain independent
- path traversal, invalid frontmatter, duplicate IDs/slugs, case-folding collisions, and managed/unmanaged collisions fail safely
- activation rejects wrong origin, credentials, HTTP, redirect, off-origin response, schema, batch, tuple, SHA-256, entry set, and entry-set hash
- one compare-and-set activates only the selected unchanged prepared batch
- activation and rollback invalidate cached article/discovery/authority decisions
- missing or mismatched deployed artifacts retain database fallback without duplicate discovery entries
- abort and rollback retain database records and generated files
- a direct repo edit causes revision mismatch and fallback; the documented rollback, republish, prepare, deploy, activate cycle works

## Commands

Use the target repo's package manager and instructions. Typical checks are:

```bash
npm run lint
npx tsc --noEmit --pretty false
npm test
npm run build
```

Prefer focused tests first. Use [convex-test](https://docs.convex.dev/testing/convex-test) where it fits. If no test runner exists, document the gap and add the smallest meaningful tests supported by the repo.

## Final Handoff

Name exact required setup and where each value belongs:

- Blogr and target hosting: `BLOG_PUBLISH_WEBHOOK_TOKEN`
- target hosting and Convex: the existing server identity or `BLOG_PUBLISH_CONVEX_SECRET`
- target hosting: `CONVEX_URL` or existing `NEXT_PUBLIC_CONVEX_URL`
- target hosting and any Convex function that directly accesses R2: access key ID, secret, endpoint, and the target's existing bucket env name
- optional repo ingestion only: `BLOG_REPO_DEPLOYMENT_ORIGIN` and the existing admin identity or `BLOG_REPO_INGEST_SECRET` in authorized local/CI and Convex/server environments
- Cloudflare: bucket plus S3-compatible credentials
- Blogr Settings: webhook URL, the matching access token, and publisher label

List schema/code generation, development push, and production deployment separately based on the target's real state. State commands run and post-deploy verification still needed. Do not claim deployment from a documentation-only skill change.
