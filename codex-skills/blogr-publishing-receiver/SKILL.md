---
name: blogr-publishing-receiver
description: Build or update a Blogr publishing receiver in a Next.js App Router target app using Convex for article records and Cloudflare R2 for durable image storage. Use when a user asks Codex to integrate Blogr publishing, add a Blogr webhook, receive Blogr blog posts, implement POST /api/webhooks/blog-publisher, or make a Next.js app publish Blogr-generated articles with Convex and R2.
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
- `references/acceptance.md` for fixtures, tests, verification, and final response requirements.

## Workflow

1. Read the target repo instructions, package files, routing tree, Convex files, storage helpers, markdown renderer, sitemap/feed code, and tests.
2. Confirm the app uses Next.js App Router. If not, stop and ask before implementing.
3. Reuse existing Convex and R2 helpers when they already exist. If Convex or R2 is missing, add the focused files needed for this integration.
4. Add `POST /api/webhooks/blog-publisher` in a Next route handler. The route must validate bearer auth, parse the Blogr payload, copy images to R2, rewrite article image URLs, upsert Convex records, refresh cached pages, and return JSON.
5. Add or reuse public `/blog` and `/blog/[slug]` pages. Lists and discovery outputs must read lightweight summary records, not full article bodies.
6. Render Blogr MDX/markdown safely, including frontmatter stripping, H1 through H6 headings, table of contents links for H2 through H6, markdown images, tables, code blocks, and whitelisted YouTube embeds.
7. Add focused docs in the target app for the webhook, env vars, file tree, setup, and verification steps.
8. Add tests that use the fixtures in `assets/fixtures/`. Mock image downloads in tests unless the target app already has a stable fixture image server.
9. Run lint, typecheck, and build before finishing when the target app provides those commands.

## Hard Rules

- Do not forward Blogr publishing requests to Convex HTTP actions, Convex `http.ts`, `.convex.site`, or any proxy route.
- Do not add `CONVEX_SITE_URL` or `NEXT_PUBLIC_CONVEX_SITE_URL` for Blogr publishing.
- Use `CONVEX_URL` or `NEXT_PUBLIC_CONVEX_URL` with `ConvexHttpClient`; that URL must be the normal `.convex.cloud` deployment URL.
- Do not store production articles or images in local files, checked-in JSON, memory, or serverless temporary filesystem paths.
- Do not save Blogr image URLs as durable public URLs. Copy every required article image to R2 first, then save the target-owned URL or key.
- Do not require `R2_TOKEN`, `R2_PUBLIC_URL`, an R2 custom domain, public bucket access, or whole-bucket public access for the default path.
- Keep `BLOG_PUBLISH_WEBHOOK_TOKEN` server-only.
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
