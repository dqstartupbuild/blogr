export const blogPublishingPayloadExample = `{
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
}`;
