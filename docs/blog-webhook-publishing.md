# Publish an article by webhook

Set `BLOG_PUBLISH_WEBHOOK_TOKEN` and a destination URL in the local server environment. A product can choose its receiver URL and source name in Settings. Its token stays in the server environment and is not saved with projects or backup exports. The **Publish** action sends the current saved article to the configured receiver and records a local published status after the receiver accepts it.

Blogr includes locally stored raster images in the webhook as base64 data, with a 10 MB combined image limit and a 20-image limit. The receiving app must implement the matching receiver contract: validate the bytes, upload them to its own image storage, and replace the exact local references in the article before saving. The receiver cannot fetch `/api/local/media/` itself. Public image URLs continue to use the receiver's existing download flow. A receiver success followed by a local status-save problem is reported as a receiver success with a local warning, so a retry does not silently duplicate publication.

Publishing needs network access. The receiver contract and payload are in `src/server/publishing/`; the route is `src/app/api/blogs/publish/route.ts`.
