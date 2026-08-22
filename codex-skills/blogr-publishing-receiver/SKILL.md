---
name: blogr-publishing-receiver
description: Build or update a Blogr publishing receiver in a Next.js App Router target app using Convex for article records and Cloudflare R2 for durable image storage. Use when a user asks a coding agent to integrate Blogr publishing, add a Blogr webhook, receive Blogr blog posts, implement POST /api/webhooks/blog-publisher, or make a Next.js app publish Blogr-generated articles with Convex and R2.
---

# Blogr Publishing Receiver

## Overview

Use this skill to add the receiving side of Blogr publishing to a target app. The current supported stack is Next.js App Router, Convex article records, and Cloudflare R2 image storage.

If the target app is not a Next.js App Router app, or the user wants a database/storage stack other than Convex and R2, explain that this skill currently covers only Next.js App Router + Convex + R2 and ask whether to proceed with that stack.

## Required References

Read these files before editing a target app:

- `references/contract.md` for webhook payloads, field mapping, auth, and response behavior.
- `references/next-app-router.md` for route placement, public blog pages, metadata, cache refresh, and setup handoff.
- `references/convex.md` for article records, summary records, indexes, and `ConvexHttpClient` rules.
- `references/r2.md` for image copying, safe downloads, object keys, uploads, and serving URLs.
- `references/mdx-rendering.md` for frontmatter, headings, table of contents, images, sanitization, and YouTube embeds.
- `references/acceptance.md` for fixtures, tests, verification, repo-ingestion acceptance, and final response requirements.

## Workflow

1. Read the target repo instructions, package files, routing tree, Convex files, storage helpers, markdown renderer, sitemap/feed code, and tests.
2. Confirm the app uses Next.js App Router. If not, stop and ask before implementing.
3. Reuse existing Convex and R2 helpers when they already exist. If Convex or R2 is missing, add the focused files needed for this integration.
4. Add `POST /api/webhooks/blog-publisher` in a Next route handler. The route must validate bearer auth, parse the complete Blogr payload, preflight ownership for every article before side effects, then copy images to R2, rewrite article image URLs, upsert Convex records, refresh cached pages, and return JSON.
5. Add or reuse public `/blog` and `/blog/[slug]` pages. Lists and discovery outputs must read lightweight summary records, not full article bodies.
6. Render Blogr MDX/markdown safely, including frontmatter stripping, H1 through H6 headings, table of contents links for H2 through H6, markdown images, tables, code blocks, and whitelisted YouTube embeds.
7. Add focused docs in the target app for the webhook, env vars, file tree, setup, and verification steps.
8. Add a user-run, two-phase repo ingestion command. It prepares deterministic checked-in MDX from published database records, then activates only after the committed files are deployed and a deployed manifest proves exact IDs and SHA-256 revisions. Pending records remain database-served.
9. Add tests that use the fixtures in `assets/fixtures/`, plus focused ingestion and fallback coverage. Mock image downloads in tests unless the target app already has a stable fixture image server.
10. Run lint, typecheck, and build before finishing when the target app provides those commands.

## Hard Rules

- Do not forward Blogr publishing requests to Convex HTTP actions, Convex `http.ts`, `.convex.site`, or any proxy route.
- Do not add `CONVEX_SITE_URL` or `NEXT_PUBLIC_CONVEX_SITE_URL` for Blogr publishing.
- Use `CONVEX_URL` or `NEXT_PUBLIC_CONVEX_URL` with `ConvexHttpClient`; that URL must be the normal `.convex.cloud` deployment URL.
- Do not use runtime mutable, serverless, or temporary filesystem storage for production articles or images. Deterministic MDX written by the explicit repo-ingestion command, committed, and deployed is allowed. Do not export binary media; keep images in R2 unless the user explicitly asks otherwise.
- Do not save Blogr image URLs as durable public URLs. Copy every required article image to R2 first, then save the target-owned URL or key.
- Do not require `R2_TOKEN`, `R2_PUBLIC_URL`, an R2 custom domain, public bucket access, or whole-bucket public access for the default path.
- Keep `BLOG_PUBLISH_WEBHOOK_TOKEN` server-only.
- Provide explicit batch commands: `npm run blogr:ingest` prints/persists a batch ID; `npm run blogr:ingest -- --activate --batch=<batchId> --deployment-url=https://...` activates only that batch; `--abort --batch=<batchId>` aborts preparing/prepared work; rollback targets an active batch. Support dry-run and targeted/all. Never commit, push, deploy, prune, or overwrite unmanaged files automatically.
- Use independent ingestion-batch/manifest records with batch ID, schema version, entry set/hash, and preparing | prepared | active | rolled_back | aborted status. Articles and summaries reference batch ID/path/revision and derive authority from that status. A source ID or slug cannot belong to more than one non-rolled-back/non-aborted batch. Prepare may safely resume pages in a preparing batch, but only marks the batch prepared after the complete export, validation, collision checks, and staged atomic writes succeed. Partial work exits nonzero with no authority transition.
- Activate only after fetching a deployed schema-versioned manifest built statically from exact checked-in MDX bytes, never database/dynamic data. Key entries by batch ID and validate each stable source ID + repo path + SHA-256 tuple and that batch's entry set/hash. Only accept `BLOG_REPO_DEPLOYMENT_ORIGIN`, a configured canonical/allowlisted HTTPS origin with no embedded credentials; reject redirects and off-origin responses. Atomically compare-and-set only the selected prepared batch to active when schema/version and entry set/hash match. Activating batch B must not deactivate active batch A. Local files cannot activate content. Preparing/prepared and failed activation remain database-served; abort detaches preparing/prepared records and marks the batch aborted, while rollback flips only the selected active batch to rolled_back without deleting records or files.
- Resolve public content repo-first only for a matching deployed artifact/revision from any active batch. Merge all active batch manifest summaries with database summaries for lists, sitemap, feed, search, and static params; dedupe stable ID then slug, retaining database content as fallback for rolling deploys and rollbacks.
- Preflight the entire webhook payload by stable ID then slug before any side effect. If any article belongs to a preparing/prepared/active batch, reject the entire request with `409`: tell the user to edit and commit repo content, or roll back to database authority and republish before preparing again. After request-owned R2 uploads, repeat ownership validation transactionally; if it fails, delete only objects created by that request or use an explicit reservation. Allow new-only database payloads to publish normally.
- Keep ingestion and activation credentials server-only, non-committed environment/admin/deploy credentials. Require `BLOG_REPO_INGEST_SECRET`, a long random secret set in both the authorized local/CI environment and Convex/server environment, unless the target already has an equivalent named admin/deploy mechanism. Do not use public unauthenticated mutations or put secrets in command arguments, browser code, or logs.
- Preserve the target repo's existing style, import aliases, validation patterns, and one-file-one-purpose conventions.

## Suggested File Shape

Follow the target app's structure first. When no matching local pattern exists, prefer focused files like:

```text
src/app/api/webhooks/blog-publisher/route.ts
src/app/api/webhooks/blog-publisher/schema.ts
src/server/blogPublisher/validateBlogPublisherToken.ts
src/server/blogPublisher/normalizeBlogPublisherArticles.ts
src/server/blogPublisher/collectBlogPublisherImageUrls.ts
src/server/blogPublisher/downloadBlogPublisherImage.ts
src/server/blogPublisher/createBlogPublisherR2Client.ts
src/server/blogPublisher/buildBlogPublisherR2Key.ts
src/server/blogPublisher/putBlogPublisherR2Object.ts
src/server/blogPublisher/getBlogPublisherImageUrl.ts
src/server/blogPublisher/rewriteBlogPublisherImageUrls.ts
src/server/blogPublisher/upsertBlogPublisherArticle.ts
src/server/blogPublisher/types/BlogPublisherArticle.ts
convex/blogPublisher/upsertBlogPublisherArticle.ts
convex/blogPublisher/listBlogPublisherSummaries.ts
convex/blogPublisher/getBlogPublisherArticleBySlug.ts
```

Only create files that the target app actually needs.
