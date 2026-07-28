# Blogr Publishing Contract

## Endpoint

Create this receiving endpoint:

```text
POST /api/webhooks/blog-publisher
```

Authentication:

- Read the `Authorization` header.
- Require `Bearer <token>`.
- Compare the token to the server-only env var `BLOG_PUBLISH_WEBHOOK_TOKEN`.
- Return `401` with `{ "error": "Invalid access token." }` when the token is missing or wrong.

## Events

Support both event shapes:

- `publish_articles`: save every item in `data.articles`.
- `update_article`: save `data.article`.

Return `400` for unknown events or missing required fields. Return `200` with `{ "message": "Published." }` after a successful create or update.

## Article Fields

Required payload fields:

- `id`
- `title`
- `seo_title`
- `slug`
- `meta_description`
- `content_format`
- `content_markdown`
- `content_mdx`
- `image_url`
- `tags`
- `source`
- `created_at`
- `updated_at`

Field mapping:

- Store `id` as `sourceId`.
- Store `title` as the visible article title.
- Store `seo_title` separately for metadata and search previews.
- Store `meta_description` as the article description.
- Store `content_mdx` as the source of truth, falling back to `content_markdown`.
- Store `image_url` only after it has been copied to target-owned R2 storage.
- Store `source` as the sending app label. Do not treat it as the article author.
- Treat `created_at` and `updated_at` as Blogr publish timestamps, not the original draft creation time.

Match existing posts by the stable Blogr `sourceId` first, then by `slug` for older records. Publishing the same article twice must update one post instead of creating duplicates. Existing posts must refresh the visible title, SEO title, description, body, image URLs, tags, source, and `updated_at` value from the new payload.

Preserve the original stored `created_at` when handling `update_article`, even if a conflicting creation date is received. The update must refresh the canonical article, its summary or read-model records, and any cached article, blog index, sitemap, or feed output.

Keep `seo_title` between 70 and 110 characters and `meta_description` between 110 and 160 characters when the target app validates these lengths.

## Fixtures

Use these skill assets for tests:

- `assets/fixtures/publish-articles.json`
- `assets/fixtures/update-article.json`
- `assets/fixtures/publish-articles-multimedia.json`

The fixture image URLs use reserved domains. Tests should mock image downloads and assert that saved content uses target-owned R2 URLs or keys.
