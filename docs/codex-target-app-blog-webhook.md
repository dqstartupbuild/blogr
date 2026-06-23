# Codex Target App Blog Webhook Brief

Copy this brief into Codex inside any target app that should receive blogs from Blogger.

## Prompt

Build a blog publishing receiver for this app.

The source app is Blogger. It sends generated blog posts to a webhook when a user clicks **Publish**.

Create a public, token-protected webhook endpoint and a simple blog system that can store and render those posts.

## Incoming Webhook

Create this endpoint:

```text
POST /api/webhooks/blog-publisher
```

Authentication:

- Read the `Authorization` header.
- Require `Bearer <token>`.
- Compare the token to `BLOG_PUBLISH_WEBHOOK_TOKEN`.
- Return `401` with `{ "error": "Invalid access token." }` when it is missing or wrong.

Expected payload:

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
        "content_markdown": "# Article body",
        "content_mdx": "# Article body",
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

Also support this single-article update shape for forward compatibility:

```json
{
  "event_type": "update_article",
  "timestamp": "2026-06-23T16:05:00.000Z",
  "data": {
    "article": {
      "id": "blog-id",
      "title": "Updated Title",
      "slug": "a-helpful-blog-title",
      "meta_description": "Updated summary.",
      "content_format": "mdx",
      "content_markdown": "# Updated body",
      "content_mdx": "# Updated body",
      "content_html": "",
      "image_url": "https://example.com/image.jpg",
      "tags": ["keyword"],
      "source": "Blogger",
      "created_at": "2026-06-23T15:30:00.000Z",
      "updated_at": "2026-06-23T16:05:00.000Z"
    }
  }
}
```

## Storage

Create or reuse a blog post model with these fields:

- `sourceId`: source article ID from Blogger.
- `title`
- `slug`
- `description`: from `meta_description`.
- `contentMdx`: prefer `content_mdx`, then `content_markdown`.
- `featureImageUrl`: from `image_url`.
- `tags`
- `publishedAt`
- `updatedAt`

Upsert by `slug`. If a post with that slug already exists, update it. If not, create it.

## Public Blog Pages

Add or reuse:

- `/blog` for the blog index.
- `/blog/[slug]` for one post.

The article page should render the MDX or markdown body, show the title, description, feature image when present, and use clear human-facing copy.

If this app already has a blog system, connect the webhook to the existing model and pages instead of creating a duplicate system.

## Next.js App Router Notes

For a Next.js App Router app, use a route handler at:

```text
src/app/api/webhooks/blog-publisher/route.ts
```

Use server-only env vars:

```bash
BLOG_PUBLISH_WEBHOOK_TOKEN=replace-with-the-same-token-used-in-blogger
```

Keep helper files focused. Suggested file tree:

```text
src/app/api/webhooks/blog-publisher/route.ts
src/app/api/webhooks/blog-publisher/schema.ts
src/server/blogPublisher/validateBlogPublisherToken.ts
src/server/blogPublisher/normalizeBlogPublisherArticles.ts
src/server/blogPublisher/upsertBlogPublisherArticle.ts
src/server/blogPublisher/types/BlogPublisherArticle.ts
```

## Receiver Behavior

Handle events this way:

- `publish_articles`: upsert every article in `data.articles`.
- `update_article`: upsert `data.article`.
- Unknown events: return `400` with a clear error.
- Missing required fields: return `400`.
- Successful publish: return `200` with `{ "message": "Published." }`.

## Acceptance Checklist

- The webhook rejects requests without the bearer token.
- The webhook accepts the Blogger payload.
- Publishing the same slug twice updates one post instead of creating duplicates.
- `/blog` lists the published post.
- `/blog/[slug]` renders the post body and feature image.
- The target app documents the webhook env var and endpoint.
- Lint, typecheck, and build pass.

## Blogger Setup After Target App Is Deployed

Set these env vars in Blogger:

```bash
BLOG_PUBLISH_WEBHOOK_URL=https://target-app-domain.com/api/webhooks/blog-publisher
BLOG_PUBLISH_WEBHOOK_TOKEN=the-same-token-set-in-the-target-app
BLOG_PUBLISH_SOURCE_NAME=Blogger
```

Then open Blogger, choose a generated post, and click **Publish**.
