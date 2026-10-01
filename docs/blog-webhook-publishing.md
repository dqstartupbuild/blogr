# Publish an article by webhook

Set `BLOG_PUBLISH_WEBHOOK_TOKEN` and a destination URL in the local server environment. A product can choose its receiver URL and source name in Settings. Its token stays in the server environment and is not saved with projects or backup exports. The **Publish** action sends the current saved article to the configured receiver and records a local published status after the receiver accepts it.

A remote receiver cannot read image URLs on `127.0.0.1`. Blogr blocks webhook publishing when an article contains locally stored images, including URLs in MDX. Export the article ZIP, upload the images to the destination, and replace local URLs before publishing. A receiver success followed by a local status-save problem is reported as a receiver success with a local warning, so a retry does not silently duplicate publication.

Publishing needs network access. The receiver contract and payload are in `src/server/publishing/`; the route is `src/app/api/blogs/publish/route.ts`.
