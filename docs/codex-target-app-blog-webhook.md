# Codex Target App Blog Webhook Brief

Copy the in-app prompt into Codex inside the target Next.js app that should receive blogs from Blogr.

The prompt first asks Codex to use `$blogr-publishing-receiver` when that skill is installed. If the skill is not installed, the prompt includes a shorter fallback brief that covers the supported stack for this version:

- Next.js App Router
- Convex article records
- Cloudflare R2 article image storage

## What Codex Should Build

The receiving app should add:

- `POST /api/webhooks/blog-publisher`
- bearer-token auth with `BLOG_PUBLISH_WEBHOOK_TOKEN`
- Convex article and summary records
- Cloudflare R2 image copying for `image_url`, markdown images, and frontmatter `featureImage`
- `/blog` and `/blog/[slug]` pages when the app does not already have them
- MDX rendering for Blogr articles, including tables, code, rewritten images, headings, table of contents links, and whitelisted YouTube embeds
- sitemap/feed/cache refresh behavior when those outputs exist
- tests for auth, payload validation, slug upserts, article updates, image rewrite behavior, MDX rendering, and discovery outputs

## Skill Source

The repo-owned skill lives at:

```text
codex-skills/blogr-publishing-receiver/
```

The skill keeps the agent-facing instructions split by purpose:

```text
codex-skills/blogr-publishing-receiver/SKILL.md
codex-skills/blogr-publishing-receiver/references/contract.md
codex-skills/blogr-publishing-receiver/references/next-app-router.md
codex-skills/blogr-publishing-receiver/references/convex.md
codex-skills/blogr-publishing-receiver/references/r2.md
codex-skills/blogr-publishing-receiver/references/mdx-rendering.md
codex-skills/blogr-publishing-receiver/references/acceptance.md
codex-skills/blogr-publishing-receiver/assets/fixtures/publish-articles.json
codex-skills/blogr-publishing-receiver/assets/fixtures/update-article.json
codex-skills/blogr-publishing-receiver/assets/fixtures/publish-articles-multimedia.json
```

## Fallback Brief

When the skill is unavailable, the copied prompt tells Codex to:

- implement the receiving route at `src/app/api/webhooks/blog-publisher/route.ts`
- accept `publish_articles` with `data.articles`
- accept `update_article` with `data.article`
- upsert by `slug`
- store `content_mdx`, falling back to `content_markdown`
- copy all article images into R2 before saving
- call Convex through `ConvexHttpClient` with `CONVEX_URL` or `NEXT_PUBLIC_CONVEX_URL` on `.convex.cloud`
- avoid `.convex.site`, `CONVEX_SITE_URL`, and `NEXT_PUBLIC_CONVEX_SITE_URL` for Blogr publishing
- avoid `R2_TOKEN`, `R2_PUBLIC_URL`, public bucket requirements, and custom domain requirements
- use lightweight Convex summaries for public list and discovery reads
- render Blogr MDX safely
- return `{ "message": "Published." }` after a successful publish
- finish with exact required setup values and verification commands

## Blogr Setup After Deployment

Open Blogr, choose the product workspace, then go to **Settings** and use the **Publishing** panel.

Enter:

- Webhook URL: `https://target-app-domain.com/api/webhooks/blog-publisher`
- Access token: the same value saved in the target app as `BLOG_PUBLISH_WEBHOOK_TOKEN`
- Publisher label: `Blogr`

The publisher label becomes the payload's `source` value. It is not the article author.
