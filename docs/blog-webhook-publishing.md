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
5. `buildBlogPublishPayload` turns the blog into a `publish_articles` webhook payload.
6. If the blog belongs to a product workspace, the route calls the Convex `publishBlogWithIntegration` action.
7. The Convex action reads the saved publishing integration for that product without returning the token to the browser.
8. If the product does not have a saved integration, the route falls back to the deployment env vars.
9. The webhook request is sent with `Authorization: Bearer <token>`.
10. The target app creates or updates the public blog post by `slug`.

Publishing uses the currently loaded draft. In the editor, that means a user can publish the text they are looking at after making changes.

## Settings Workflow

Open **Settings** for the active product workspace, then use the **Publishing** panel.

The panel starts with a **Setup guide**. It gives the user the full workflow, a copyable Codex prompt for the target app, the webhook path, the token env var, a sample payload, and a quick checklist for the receiving app.

The user enters:

- Webhook URL
- Access token
- Source name

The access token is saved server-side in Convex and is not returned to the browser. The settings screen only shows whether a token is already saved.

Click **Save publishing** to connect that product. Click **Remove** to disconnect publishing for that product.

If a user clicks **Publish** before connecting a product, the publish message includes a **Set up publishing** shortcut back to Settings.

## Env Fallback

Product settings are the normal setup path. Env vars still work as a fallback for demos, previews, or single-destination deployments.

Set these env vars on the Blogger deployment:

```bash
BLOG_PUBLISH_WEBHOOK_URL=https://your-target-app.com/api/webhooks/blog-publisher
BLOG_PUBLISH_WEBHOOK_TOKEN=replace-with-a-long-secret
BLOG_PUBLISH_SOURCE_NAME=Blogger
BLOG_PUBLISH_TIMEOUT_MS=15000
```

`BLOG_PUBLISH_SOURCE_NAME` defaults to `Blogger`. `BLOG_PUBLISH_TIMEOUT_MS` defaults to 15000 and is capped at 60000.

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
        "slug": "a-helpful-blog-title",
        "meta_description": "A short plain-language summary.",
        "content_format": "mdx",
        "content_markdown": "---\\ntitle: ...",
        "content_mdx": "---\\ntitle: ...",
        "content_html": "",
        "image_url": "https://example.com/image.jpg",
        "tags": ["keyword"],
        "source": "Blogger",
        "created_at": "2026-06-23T15:30:00.000Z",
        "updated_at": "2026-06-23T15:45:00.000Z"
      }
    ]
  }
}
```

MDX is the source of truth. `content_html` is intentionally blank because this app stores and edits articles as MDX.

## Target App Expectations

The receiving app should:

- Accept `POST /api/webhooks/blog-publisher`.
- Read `Authorization: Bearer <token>`.
- Compare the token to a server-only env var.
- Validate `event_type`, `timestamp`, and article fields.
- Upsert by `slug` so publishing the same blog again updates the existing post.
- Store `content_mdx` or `content_markdown`.
- Use `image_url` as the feature image unless the target app copies images into its own storage.
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
- `src/app/api/blogs/publish/schema.ts`
- `src/server/publishing/getBlogPublishEnvironmentDestination.ts`
- `src/server/publishing/buildBlogPublishPayload.ts`
- `src/server/publishing/buildBlogPublishArticle.ts`
- `src/server/publishing/sendBlogPublishWebhook.ts`
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
convex/products/*BlogPublishing*
convex/products/publishBlogWithIntegration.ts
docs/blog-webhook-publishing.md
docs/codex-target-app-blog-webhook.md
```
