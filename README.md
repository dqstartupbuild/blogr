# Blogr

Blogr is a local workspace for planning topics and writing longform MDX articles. Projects, topic lists, calendar dates, articles, versions, settings, and managed images are saved on your computer. No account or hosted database is needed. Website scanning, topic research, AI writing, image generation, and webhook publishing use optional outside services when you configure their keys.

## Local setup

1. Install dependencies in this repository: `npm install`.
2. Copy `.env.example` to `.env.local` and add only the provider keys you want to use.
3. Start the local server: `npm run dev`.
4. Open [http://127.0.0.1:3000](http://127.0.0.1:3000). Create a project to begin.

The server binds to `127.0.0.1`. Data is stored under `~/.blogr` by default. Set `BLOGR_HOME` to another folder before starting if you want a different location. Closing and reopening the server does not remove your work. In **Settings → Backups**, back up one workspace or everything. Restoring a workspace backup adds or replaces just that workspace; restoring a full backup replaces all local work after confirmation.

For a built local installation, set `BLOGR_MODE=local-production` in `.env.local`, then run `npm run build` and `npm run start`. Both development and production are local device modes. `BLOGR_MODE` accepts `local-development`, `local-production`, or `test`; invalid values fail startup. Production also fails when the mode is missing or set to `local-development`. Test mode requires an isolated `BLOGR_HOME`. No hosted mode or account fallback exists.

## Optional services

- `FIRECRAWL_API_KEY` scans a product site, refreshes links, and researches articles.
- `APIFY_TOKEN` supports Google topic discovery and research.
- `REPLICATE_API_TOKEN`, `REPLICATE_WRITER_MODEL`, `REPLICATE_IMAGE_PLANNER_MODEL`, and `REPLICATE_IMAGE_MODEL` support AI writing and images.
- `YOUTUBE_API_KEY` and `EXA_API_KEY` are optional video research providers.
- `BLOG_PUBLISH_WEBHOOK_URL`, `BLOG_PUBLISH_WEBHOOK_TOKEN`, and `BLOG_PUBLISH_SOURCE_NAME` configure a publishing receiver. `BLOG_PUBLISH_WEBHOOK_TOKENS` can instead provide a JSON map from local project UUIDs to separate tokens; the project token takes priority over the global token. A product can override the URL and source name in Settings. Keep tokens in the server environment. Locally stored raster images are included in the webhook as base64 data, up to 20 images and 2 MB combined per article. The complete request is limited to 4 MB. The receiving app must upload images to its own storage and replace the local references.

Provider keys are kept in the server environment and are never included in a workspace backup. Manual project setup, topic and calendar editing, blank article creation, article editing, ZIP export, and backups work without these services. Scanning, research, generation, and publishing require network access and the relevant key.

## Project information

- [How Blogr works](docs/architecture.md)
- [Workspaces and backups](docs/workspaces-and-backups.md)
- [Topics and calendar](docs/topics-and-calendar.md)
- [Articles](docs/articles.md)
- [Settings](docs/settings.md)
- [Publishing to your blog](docs/publishing.md)
- [MIT License](LICENSE)
- [Branding policy](BRANDING.md)
- [Security policy](SECURITY.md)
- [Contributing guide](CONTRIBUTING.md)
