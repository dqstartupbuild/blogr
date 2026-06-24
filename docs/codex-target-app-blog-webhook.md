# Codex Target App Blog Webhook Brief

Copy this brief into Codex inside any target app that should receive blogs from Blogger.

## Prompt

Build a blog publishing receiver for this app.

The source app is Blogger. It sends generated blog posts to a webhook when a user clicks **Publish**.

Create a public, token-protected webhook endpoint and a simple blog system that can store and render those posts.

The target app must own the public blog content after a publish. Do not store Blogger image URLs as permanent public image URLs. Blogger can send signed image URLs that are only temporary.

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
- `featureImageUrl`: the target app's stored copy of `image_url`.
- `tags`
- `publishedAt`
- `updatedAt`

Upsert by `slug`. If a post with that slug already exists, update it. If not, create it.

## Image Ingestion

Blogger image URLs are source URLs for ingestion, not durable public URLs for the target blog.

During the webhook request:

- Collect every image URL the article uses:
  - `image_url`
  - markdown image URLs in `content_mdx` and `content_markdown`
  - `featureImage` in YAML frontmatter when present
- Download those images server-side before saving the article.
- Store the images in the target app's own durable public storage, or reuse the target app's existing media/object storage system.
- Rewrite `image_url`, frontmatter `featureImage`, and every markdown image URL in the saved body to the target app's stored image URLs.
- Preserve markdown image alt text where possible.
- Use safe fetching: allow only `http` and `https`, verify image content types, set a timeout, enforce a reasonable file-size limit, and return a clear `400` if required images cannot be copied.
- Avoid hotlinking Blogger URLs in public pages because those URLs can expire or return `400`.

If the target app cannot store images yet, add the storage needed for this workflow instead of leaving Blogger URLs in the saved post.

## MDX And Embeds

Blogger sends `content_format: "mdx"` and keeps the full article body in `content_mdx`. The target app should render the formats Blogger writes, not only plain paragraphs.

Support at least:

- YAML frontmatter, including stripping it from visible article content.
- Headings, paragraphs, bold, italic, links, ordered lists, unordered lists, blockquotes, tables, horizontal rules, inline code, and fenced code blocks.
- Markdown image syntax after image URLs have been rewritten to target-owned URLs.
- Raw HTML or MDX iframe embeds for YouTube videos that use `youtube.com/embed` or `youtube-nocookie.com/embed`.
- Standalone YouTube watch URLs or markdown links from `youtube.com`, `m.youtube.com`, `music.youtube.com`, `youtube-nocookie.com`, and `youtu.be`, rendered as embedded players when possible.

Sanitize rendered content. Do not allow arbitrary scripts, unsafe event handlers, or untrusted iframe sources.

## Public Blog Pages

Add or reuse:

- `/blog` for the blog index.
- `/blog/[slug]` for one post.

The article page should render the MDX or markdown body, show the title, description, feature image when present, render article images and YouTube videos, and use clear human-facing copy.

If this app already has a blog system, connect the webhook to the existing model and pages instead of creating a duplicate system.

## SEO And Discovery

Webhook-published posts must be discoverable the same way built-in posts are.

Update or add:

- canonical metadata for `/blog/[slug]`
- Open Graph and social metadata, including the stored feature image when present
- sitemap entries with useful `lastmod` dates
- RSS/feed entries if the app has a feed
- any existing blog index, search, related-post, static params, or content registry flow that should include public blog posts

If the framework caches routes, revalidate or refresh `/blog`, `/blog/[slug]`, sitemap, feed, and any related cached blog data after a successful webhook publish.

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
src/server/blogPublisher/collectBlogPublisherImageUrls.ts
src/server/blogPublisher/storeBlogPublisherImage.ts
src/server/blogPublisher/rewriteBlogPublisherImageUrls.ts
src/server/blogPublisher/validateBlogPublisherToken.ts
src/server/blogPublisher/normalizeBlogPublisherArticles.ts
src/server/blogPublisher/upsertBlogPublisherArticle.ts
src/server/blogPublisher/renderBlogPublisherMdx.ts
src/server/blogPublisher/types/BlogPublisherArticle.ts
```

## Receiver Behavior

Handle events this way:

- `publish_articles`: upsert every article in `data.articles`.
- `update_article`: upsert `data.article`.
- Unknown events: return `400` with a clear error.
- Missing required fields: return `400`.
- Image copy failures for required article images: return `400` with a clear error.
- Successful publish: return `200` with `{ "message": "Published." }`.

## Acceptance Checklist

- The webhook rejects requests without the bearer token.
- The webhook accepts the Blogger payload.
- Publishing the same slug twice updates one post instead of creating duplicates.
- The webhook copies `image_url` and markdown images into target-owned storage.
- Saved article content uses target-owned image URLs, not Blogger URLs.
- `/blog` lists the published post.
- `/blog/[slug]` renders the post body, feature image, inline images, tables, code blocks, and YouTube videos.
- Sitemap and feed outputs include webhook-published posts.
- Cached blog routes and discovery outputs refresh after publishing.
- The target app documents the webhook env var and endpoint.
- Lint, typecheck, and build pass.

## Blogger Setup After Target App Is Deployed

Open Blogger, choose the product workspace, then go to **Settings** and use the **Publishing** panel.

Enter:

- Webhook URL: `https://target-app-domain.com/api/webhooks/blog-publisher`
- Access token: the same value saved in the target app as `BLOG_PUBLISH_WEBHOOK_TOKEN`
- Source name: `Blogger`

Then open Blogger, choose a generated post, and click **Publish**.
