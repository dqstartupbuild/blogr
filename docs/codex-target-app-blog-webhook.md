# Codex Target App Blog Webhook Brief

Copy this brief into Codex inside any target app that should receive blogs from Blogr.

## Prompt

Build a blog publishing receiver for this app.

The source app is Blogr. It sends generated blog posts to a webhook when a user clicks **Publish**.

Create a public, token-protected webhook endpoint and a simple blog system that can store and render those posts.

The target app must own the public blog content after a publish. Do not store Blogr image URLs as permanent public image URLs. Blogr can send signed image URLs that are only temporary.

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
        "seo_title": "A Helpful Blog Title for Search Results With Clear Next Steps and Examples",
        "slug": "a-helpful-blog-title",
        "meta_description": "A helpful plain-English summary that tells readers what they will learn, why it matters, and what next step they can take.",
        "content_format": "mdx",
        "content_markdown": "# Article body",
        "content_mdx": "# Article body",
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

Also support this single-article update shape for forward compatibility:

```json
{
  "event_type": "update_article",
  "timestamp": "2026-06-23T16:05:00.000Z",
  "data": {
      "article": {
        "id": "blog-id",
        "title": "Updated Title",
        "seo_title": "Updated Title for Search Results With Clear Reader-Focused Next Steps and Examples",
        "slug": "a-helpful-blog-title",
        "meta_description": "An updated plain-English summary that tells readers what changed, why it matters, and what next step they can take.",
      "content_format": "mdx",
      "content_markdown": "# Updated body",
      "content_mdx": "# Updated body",
      "content_html": "",
      "image_url": "https://example.com/image.jpg",
      "tags": ["content planning", "team priorities", "weekly planning"],
      "source": "Blogr",
      "created_at": "2026-06-23T16:05:00.000Z",
      "updated_at": "2026-06-23T16:05:00.000Z"
    }
  }
}
```

## Storage

Before implementing storage, inspect the target repo for:

- an existing durable database or content model
- an existing durable media/object storage system

If both already exist, reuse them and follow the repo's local patterns.

If either one is missing, ask the user which database and object storage they prefer before building that part. Present this as the recommended default:

- Database: Convex article records.
- Object storage: Cloudflare R2 through the Convex R2 component, `@convex-dev/r2`.

If the user says to choose, does not care, or asks for the default, use Convex for blog article records and Cloudflare R2 through `@convex-dev/r2` for downloaded article images.

Do not implement production article or media storage with local writable files, checked-in JSON, in-memory state, or any serverless/ephemeral filesystem path.

Create or reuse a blog post model with these fields:

- `sourceId`: source article ID from Blogr.
- `title`: visible article title.
- `seoTitle`: from `seo_title`, used for SEO metadata and search previews.
- `slug`
- `description`: from `meta_description`.
- `contentMdx`: prefer `content_mdx`, then `content_markdown`.
- `featureImageUrl`: the target app's stored copy of `image_url`.
- `tags`
- `publishedAt`
- `updatedAt`

Upsert by `slug`. If a post with that slug already exists, update it. If not, create it. On every create or update, save the current `title`, `seo_title`, `meta_description`, content, images, tags, `source`, `created_at`, and `updated_at` values from the payload.

Treat `created_at` and `updated_at` as the time Blogr sent the publish request, not the time the draft was first created.

Keep `seoTitle` between 70 and 110 characters. Keep `description` between 110 and 160 characters.

When using the default Convex and R2 path:

- Install `convex` when the app does not already use it.
- Install `@convex-dev/r2`.
- Add the R2 component in `convex/convex.config.ts` with `app.use(r2)`.
- Create an R2 client from `components.r2`.
- Store downloaded images from a Convex action with `r2.store`.
- Save the returned R2 object keys on article records.
- Serve images by resolving keys with `r2.getUrl`.
- Document these Convex env vars: `R2_TOKEN`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_ENDPOINT`, and `R2_BUCKET`.
- Do not require `R2_PUBLIC_URL`, an R2 custom domain, a public bucket, or whole-bucket public access. Prefer signed URLs from the existing storage layer or `@convex-dev/r2`'s `r2.getUrl`. Only add public access when the user explicitly asks for that tradeoff.

## Image Ingestion

Blogr image URLs are source URLs for ingestion, not durable public URLs for the target blog.

During the webhook request:

- Collect every image URL the article uses:
  - `image_url`
  - markdown image URLs in `content_mdx` and `content_markdown`
  - `featureImage` in YAML frontmatter when present
- Download those images server-side before saving the article.
- Store the images in durable object storage, preferring the existing media/object storage system when one exists and otherwise the selected/default object storage from the storage decision above.
- Rewrite `image_url`, frontmatter `featureImage`, and every markdown image URL in the saved body to the target app's stored image URLs.
- Preserve markdown image alt text where possible.
- Use safe fetching: allow only `http` and `https`, verify image content types, set a timeout, enforce a reasonable file-size limit, and return a clear `400` if required images cannot be copied.
- Avoid hotlinking Blogr URLs in public pages because those URLs can expire or return `400`.

If the target app cannot store images yet, ask for the user's storage preference and default to Convex plus Cloudflare R2 through `@convex-dev/r2` when the user wants the default. Do not leave Blogr URLs in the saved post.

## MDX And Embeds

Blogr sends `content_format: "mdx"` and keeps the full article body in `content_mdx`. The target app should render the formats Blogr writes, not only plain paragraphs.

Support at least:

- YAML frontmatter, including stripping it from visible article content.
- H1 through H6 headings, paragraphs, bold, italic, links, ordered lists, unordered lists, blockquotes, tables, horizontal rules, inline code, and fenced code blocks.
- Markdown image syntax after image URLs have been rewritten to target-owned URLs.
- Raw HTML or MDX iframe embeds for YouTube videos that use `youtube.com/embed` or `youtube-nocookie.com/embed`.
- Standalone YouTube watch URLs or markdown links from `youtube.com`, `m.youtube.com`, `music.youtube.com`, `youtube-nocookie.com`, and `youtu.be`, rendered as embedded players when possible.

Blogr articles commonly start with a `#` H1. Render that line as an H1, not as literal text. If the article page generates heading IDs, apply stable IDs to H1 through H6.

Keep article table-of-contents links focused on H2 through H6 sections. The article H1 should render normally but should not become a table-of-contents item.

Blogr's YouTube iframe output can be a multi-line block with an opening `<iframe` line, attributes such as `src`, `title`, `allow`, and `allowFullScreen` on separate lines, and a closing `</iframe>`. Older or imported content may use self-closing iframe tags. Do not only match one-line iframe strings. If the markdown or MDX renderer would show the iframe markup as raw text, transform Blogr's whitelisted YouTube iframe shape into a safe embed component before rendering.

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
BLOG_PUBLISH_WEBHOOK_TOKEN=replace-with-the-same-token-used-in-blogr
```

If the target app uses the default Convex R2 storage path, also set these in Convex:

```bash
npx convex env set R2_TOKEN <token>
npx convex env set R2_ACCESS_KEY_ID <access-key-id>
npx convex env set R2_SECRET_ACCESS_KEY <secret-access-key>
npx convex env set R2_ENDPOINT <endpoint>
npx convex env set R2_BUCKET <bucket>
```

Do not add `R2_PUBLIC_URL` or require an R2 custom domain for the default path. A CORS policy and signed serving URLs are enough unless the user explicitly chooses public bucket access.

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
- Existing posts must update their visible title, SEO title, description, body, image URLs, tags, source, and timestamps from the new payload.
- Unknown events: return `400` with a clear error.
- Missing required fields: return `400`.
- Image copy failures for required article images: return `400` with a clear error.
- Successful publish: return `200` with `{ "message": "Published." }`.

## Acceptance Checklist

- The webhook rejects requests without the bearer token.
- The webhook accepts the Blogr payload.
- Publishing the same slug twice updates one post instead of creating duplicates.
- `update_article` refreshes the saved SEO title and description for the existing post.
- The webhook copies `image_url` and markdown images into target-owned storage.
- Saved article content uses target-owned image URLs, not Blogr URLs.
- `/blog` lists the published post.
- `/blog/[slug]` renders the post body, feature image, inline images, tables, code blocks, and YouTube videos.
- `/blog/[slug]` renders `#` H1 headings as headings while keeping table-of-contents entries scoped to H2 through H6.
- `/blog/[slug]` renders Blogr's multi-line YouTube iframe blocks instead of showing the raw iframe markup.
- Sitemap and feed outputs include webhook-published posts.
- Cached blog routes and discovery outputs refresh after publishing.
- The target app documents the webhook env var and endpoint.
- The implementation handoff names every required variable and groups them by where they must be set: hosting/server env, Convex deployment env, Cloudflare/R2, database setup, and Blogr Settings.
- The implementation handoff lists every manual setup step still required after code is merged.
- Lint, typecheck, and build pass.

## Final Handoff Requirements

Before finishing, audit every setup value and manual step the target app needs.

The final response must include a clear **Required setup** section with:

- Vercel, hosting, or server env vars, including `BLOG_PUBLISH_WEBHOOK_TOKEN` and any site URL or framework-specific env vars needed by the implementation.
- Convex deployment env vars, including `R2_TOKEN`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_ENDPOINT`, and `R2_BUCKET` when Convex R2 is used.
- Database setup steps, including Convex project setup, schema deployment, migrations, seed steps, or commands the user must run.
- Cloudflare/R2 setup steps, including bucket creation, API token creation, CORS policy, and signed URL behavior the implementation expects. Do not require `R2_PUBLIC_URL`, an R2 custom domain, a public bucket, or whole-bucket public access unless the user explicitly chose that setup.
- Blogr setup steps: webhook URL, access token, and publisher label to enter in Blogr Settings. The publisher label becomes the payload's `source` value and is not the article author.
- Optional env vars or follow-up steps, clearly labeled optional.
- Verification commands that were run and anything the user still needs to run after deployment.

Do not finish with vague wording like "set the needed env vars." Name every variable and where it must be set.

## Blogr Setup After Target App Is Deployed

Open Blogr, choose the product workspace, then go to **Settings** and use the **Publishing** panel.

Enter:

- Webhook URL: `https://target-app-domain.com/api/webhooks/blog-publisher`
- Access token: the same value saved in the target app as `BLOG_PUBLISH_WEBHOOK_TOKEN`
- Publisher label: `Blogr`

Then open Blogr, choose a generated post, and click **Publish**.

If publishing returns `Invalid access token.`, the receiving app is reachable but the token in Blogr does not exactly match `BLOG_PUBLISH_WEBHOOK_TOKEN` in the target app's active deployment. Check for copied spaces, quotes, stale deployment env vars, or setting the token in the wrong environment.
