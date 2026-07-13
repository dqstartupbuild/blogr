# Blog Webhook Publishing

## What It Does

Users can publish a generated blog to another app with the **Publish** button.

The target app owns the public blog. This app sends the generated article to that target app through a bearer-token webhook, using the same shape as the Outrank-style webhook reference.

Each product workspace can have its own publishing integration. This lets one account publish different products or clients to different blog apps without changing deployment env vars.

## How It Works

1. A user clicks **Publish** from the blog preview or editor header.
2. The client calls `POST /api/blogs/publish` with the loaded blog draft.
3. The route checks the signed-in user with `requireRouteUserId`.
4. The route validates the blog payload with the shared blog item schema.
5. `buildBlogPublishPayload` turns the blog into a `publish_articles` webhook payload with clean article tags.
6. If the blog belongs to a product workspace, the route calls the Convex `publishBlogWithIntegration` action.
7. The Convex action reads the saved publishing integration for that product without returning the token to the browser.
8. If the product does not have a saved integration, the route falls back to the deployment env vars.
9. The webhook request is sent with `Authorization: Bearer <token>`.
10. The target app copies article images into its own durable public storage, rewrites the saved article image URLs, and creates or updates the public blog post by `slug`.
11. After a successful webhook response, Blogr marks the saved blog as `published`.

Publishing uses the currently loaded draft. In the editor, that means a user can publish the text they are looking at after making changes.

Published blogs keep their `published` status in the Blogs tab, so users can filter published posts away from drafts that still need to be sent.

Tags come from the saved blog tag list when it exists. Older blogs get clean fallback tags from the current keyword, title, SEO title, and meta description. Internal planning phrases are removed before the tags are sent.

The article `created_at` and `updated_at` values use the time the user clicks **Publish**. They do not use the draft creation time, so the target blog can show when the article was actually sent live.

## Settings Workflow

Open **Settings** for the active product workspace, then use the **Publishing** panel.

The panel starts with a **Setup guide**. It gives the user a copyable Codex prompt for the target app, the webhook path, the token env var, a sample payload, and a quick checklist for the receiving app.

The copyable Codex prompt now asks Codex to use `$blogr-publishing-receiver` when that skill is installed. If the skill is not installed, the prompt tells Codex to keep going with a shorter fallback brief. This first version focuses only on Next.js App Router targets that use Convex article records and Cloudflare R2 for copied article images.

The repo-owned skill lives in `codex-skills/blogr-publishing-receiver/`. It keeps the long implementation guidance in focused reference files for the webhook contract, Next.js App Router, Convex records, R2 image storage, MDX rendering, and acceptance tests. It also includes fixture payloads for `publish_articles`, `update_article`, and a multimedia article with frontmatter, markdown images, tables, code, and a multiline YouTube iframe.

The prompt and skill steer target apps away from forwarding Blogr publishing requests to Convex HTTP actions. The target webhook should validate the token, parse the payload, copy images, call Convex through `ConvexHttpClient` on the normal `.convex.cloud` URL, and revalidate blog routes from the receiving server route. They explicitly say not to add or rely on `CONVEX_SITE_URL`, `NEXT_PUBLIC_CONVEX_SITE_URL`, or `.convex.site` for Blogr publishing.

The prompt and skill also tell the target app to keep public blog reads small. Convex targets should use lightweight summary or read-model records for blog lists, sitemap/feed metadata, search/filter data, and static params instead of loading full article bodies or image arrays.

The user enters:

- Webhook URL
- Access token
- Publisher label

The access token is saved server-side in Convex and is not returned to the browser. The settings screen only shows whether a token is already saved.

Click **Save publishing** to connect that product. Click **Remove** to disconnect publishing for that product.

If a user clicks **Publish** before connecting a product, the publish message includes a **Set up publishing** shortcut back to Settings.

## Env Fallback

Product settings are the normal setup path. Env vars still work as a fallback for demos, previews, or single-destination deployments.

Set these env vars on the Blogr deployment:

```bash
BLOG_PUBLISH_WEBHOOK_URL=https://your-target-app.com/api/webhooks/blog-publisher
BLOG_PUBLISH_WEBHOOK_TOKEN=replace-with-a-long-secret
BLOG_PUBLISH_SOURCE_NAME=Blogr
BLOG_PUBLISH_TIMEOUT_MS=15000
```

`BLOG_PUBLISH_SOURCE_NAME` defaults to `Blogr`. `BLOG_PUBLISH_TIMEOUT_MS` defaults to 15000 and is capped at 60000.

## Webhook Payload

The route sends this shape:

```json
{
  "event_type": "publish_articles",
  "timestamp": "2026-06-23T16:00:00.000Z",
  "data": {
    "articles": [
      {
        "id": "blog-id",
        "title": "A Helpful Blog Title",
        "seo_title": "A Helpful Blog Title for Search Results With Clear Next Steps and Examples",
        "slug": "a-helpful-blog-title",
        "meta_description": "A helpful plain-English summary that tells readers what they will learn, why it matters, and what next step they can take.",
        "content_format": "mdx",
        "content_markdown": "---\\ntitle: ...",
        "content_mdx": "---\\ntitle: ...",
        "content_html": "",
        "image_url": "https://example.com/image.jpg",
        "tags": ["content planning", "team priorities", "weekly planning"],
        "source": "Blogr",
        "created_at": "2026-06-23T16:00:00.000Z",
        "updated_at": "2026-06-23T16:00:00.000Z"
      }
    ]
  }
}
```

MDX is the source of truth. `content_html` is intentionally blank because this app stores and edits articles as MDX. Blogr can include YAML frontmatter, H1 through H6 headings, markdown images, tables, code blocks, and YouTube iframe embeds in the MDX body.

## Target App Expectations

The receiving app should:

- Accept `POST /api/webhooks/blog-publisher`.
- Read `Authorization: Bearer <token>`.
- Compare the token to `BLOG_PUBLISH_WEBHOOK_TOKEN`.
- Validate `event_type`, `timestamp`, and article fields.
- Upsert by `slug` so publishing the same blog again updates the existing post.
- On every create or update, save the current title, SEO title, meta description, body, images, tags, source, and timestamps from the payload.
- Treat `created_at` and `updated_at` as the Blogr publish request time.
- Store `seo_title` separately from the visible article title.
- Keep `seo_title` between 70 and 110 characters and `meta_description` between 110 and 160 characters.
- Store `content_mdx` or `content_markdown`.
- Treat `image_url` and markdown image URLs as temporary source URLs.
- Download article images during the webhook request, store them in Cloudflare R2, and rewrite `image_url`, frontmatter `featureImage`, and markdown image URLs before saving the post.
- Own the publishing orchestration in the receiving server route. Do not forward Blogr publishing to Convex HTTP actions or `.convex.site`.
- Use Convex for article records. Call Convex from the receiving server route with `ConvexHttpClient` and `CONVEX_URL` or `NEXT_PUBLIC_CONVEX_URL` on `.convex.cloud`.
- Keep public blog reads small. Do not load full article bodies, MDX, image arrays, or large metadata for blog index pages, sitemap, RSS/feed, search, related posts, static params, or filter views.
- Store full content in the canonical article record, but use lightweight Convex summary or read-model records for list and discovery views.
- Update any summary or read-model data during webhook create or update, and revalidate cached blog pages after publishing.
- Use indexed slug lookups and cursor pagination for lists.
- Prefer read-model tables for public lists, sitemap/feed metadata, and search/filter options. Avoid live subscriptions on public blog pages unless live updates are truly needed.
- Do not require `CONVEX_SITE_URL`, `NEXT_PUBLIC_CONVEX_SITE_URL`, `R2_TOKEN`, `R2_PUBLIC_URL`, an R2 custom domain, a public bucket, or whole-bucket public access.
- Finish with a required setup handoff that names every variable and groups it by where it must be set, including hosting/server env vars, Convex deployment env vars, Cloudflare/R2 setup, database setup, Blogr Settings, optional follow-ups, and verification commands.
- Treat the Blogr publisher label as the webhook payload's `source` value. It is a sending-app label, not the article author.
- Render Blogr MDX features including frontmatter stripping, H1 through H6 headings, links, lists, blockquotes, tables, code, markdown images, and YouTube iframe embeds or YouTube links.
- Render article `#` H1 lines as headings while keeping generated table-of-contents entries focused on H2 through H6 sections.
- Support Blogr's multi-line YouTube iframe blocks and older self-closing iframe variants. If the target renderer would show the iframe markup as raw text, transform whitelisted YouTube iframe markup into a safe embed component before rendering.
- Include webhook-published posts in sitemap/feed outputs and refresh cached blog pages after publishing.
- Return a JSON response with `{ "message": "Published." }`.

## Troubleshooting

If publishing works for one product but fails for another with `Method Not Allowed`, that product is usually connected to the wrong receiving URL.

Check that product's **Settings** page and make sure the Webhook URL points to the receiving app's blog publishing endpoint, not a public blog page or another API route. The receiving route must accept `POST /api/webhooks/blog-publisher`.

If the receiving app logs `Invalid access token.`, the webhook URL is correct but the saved token does not exactly match the target app's `BLOG_PUBLISH_WEBHOOK_TOKEN` in the active deployment. Check for copied spaces, quotes, stale deployment env vars, or setting the token in the wrong environment.

## Security

The target webhook must be public but token-protected. Never put the webhook token in browser code.

Saved product tokens are only read by Convex functions and the Next.js publish route. Client product queries return `hasAccessToken` instead of the token value.

Bearer auth is enough for the first version because this is a server-to-server webhook. If the receiver later needs stronger replay protection, add a timestamped HMAC header while keeping bearer auth for compatibility.

## Relevant Code

- `src/features/workspace/components/BlogPublishButton.tsx`
- `src/features/workspace/components/BlogPublishingIntegrationPanel.tsx`
- `src/features/workspace/components/BlogPublishingSetupGuide.tsx`
- `src/features/workspace/components/BlogPublishingReceiverDetails.tsx`
- `src/features/workspace/utils/publishBlog.ts`
- `src/features/workspace/utils/buildBlogPublishingCodexPrompt.ts`
- `codex-skills/blogr-publishing-receiver/SKILL.md`
- `codex-skills/blogr-publishing-receiver/references/*`
- `codex-skills/blogr-publishing-receiver/assets/fixtures/*`
- `src/app/api/blogs/publish/route.ts`
- `src/app/api/blogs/publish/markPublishedBlogStatus.ts`
- `src/app/api/blogs/publish/schema.ts`
- `src/server/publishing/getBlogPublishEnvironmentDestination.ts`
- `src/server/publishing/buildBlogPublishTags.ts`
- `src/server/publishing/buildBlogPublishPayload.ts`
- `src/server/publishing/buildBlogPublishArticle.ts`
- `src/server/publishing/sendBlogPublishWebhook.ts`
- `convex/blogs/markBlogPublished.ts`
- `convex/products/updateBlogPublishingIntegration.ts`
- `convex/products/getBlogPublishingIntegration.ts`
- `convex/products/publishBlogWithIntegration.ts`

## File Tree

```text
src/app/api/blogs/publish/
src/server/publishing/
src/server/publishing/types/
src/features/workspace/components/BlogPublishingIntegrationPanel.tsx
src/features/workspace/components/BlogPublishingSetupGuide.tsx
src/features/workspace/constants/publishing/
src/features/workspace/components/BlogPublishButton.tsx
src/features/workspace/utils/publishBlog.ts
src/features/workspace/utils/buildBlogPublishingCodexPrompt.ts
src/features/workspace/types/integrations/
src/features/workspace/types/publishing/
convex/blogs/markBlogPublished.ts
convex/products/*BlogPublishing*
convex/products/publishBlogWithIntegration.ts
docs/blog-webhook-publishing.md
docs/blogr-publishing-receiver-skill.md
docs/blog-tags.md
docs/blog-published-status-filter.md
docs/codex-target-app-blog-webhook.md
```
