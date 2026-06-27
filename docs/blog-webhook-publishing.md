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

## Settings Workflow

Open **Settings** for the active product workspace, then use the **Publishing** panel.

The panel starts with a **Setup guide**. It gives the user the full workflow, a copyable Codex prompt for the target app, the webhook path, the token env var, a sample payload, and a quick checklist for the receiving app.

The copyable Codex prompt tells the target app to inspect its existing database and object storage first. If durable storage is missing, it tells Codex to ask the user for a preference while recommending Convex article records and Cloudflare R2 through the Convex R2 component as the default. It also tells the target app to copy Blogr image URLs into durable object storage, rewrite article image URLs before saving, render Blogr's MDX and YouTube embeds, and include webhook-published posts in sitemap/feed discovery outputs.

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
        "created_at": "2026-06-23T15:30:00.000Z",
        "updated_at": "2026-06-23T15:45:00.000Z"
      }
    ]
  }
}
```

MDX is the source of truth. `content_html` is intentionally blank because this app stores and edits articles as MDX. Blogr can include YAML frontmatter, markdown images, tables, code blocks, and YouTube iframe embeds in the MDX body.

## Target App Expectations

The receiving app should:

- Accept `POST /api/webhooks/blog-publisher`.
- Read `Authorization: Bearer <token>`.
- Compare the token to a server-only env var.
- Validate `event_type`, `timestamp`, and article fields.
- Upsert by `slug` so publishing the same blog again updates the existing post.
- On every create or update, save the current title, SEO title, meta description, body, images, tags, source, and timestamps from the payload.
- Store `seo_title` separately from the visible article title.
- Keep `seo_title` between 70 and 110 characters and `meta_description` between 110 and 160 characters.
- Store `content_mdx` or `content_markdown`.
- Treat `image_url` and markdown image URLs as temporary source URLs.
- Download article images during the webhook request, store them in the target app's durable object storage, and rewrite `image_url`, frontmatter `featureImage`, and markdown image URLs before saving the post.
- Ask the user for database and object storage preferences if the target app does not already have durable systems, defaulting to Convex and Cloudflare R2 through `@convex-dev/r2` when the user wants the default.
- Finish with a required setup handoff that names every variable and groups it by where it must be set, including hosting/server env vars, Convex deployment env vars, Cloudflare/R2 setup, database setup, Blogr Settings, optional follow-ups, and verification commands.
- Treat the Blogr publisher label as the webhook payload's `source` value. It is a sending-app label, not the article author.
- Render Blogr MDX features including frontmatter stripping, headings, links, lists, blockquotes, tables, code, markdown images, and YouTube iframe embeds or YouTube links.
- Include webhook-published posts in sitemap/feed outputs and refresh cached blog pages after publishing.
- Return a JSON response with `{ "message": "Published." }`.

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
docs/blog-tags.md
docs/blog-published-status-filter.md
docs/codex-target-app-blog-webhook.md
```
