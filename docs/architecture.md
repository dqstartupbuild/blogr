# How Blogr works

Blogr is a single-person app that runs on your own computer. There are no accounts and no cloud database. Opening the local Next.js server gives you your workspaces directly.

## Where your work lives

Everything is saved in one folder: `BLOGR_HOME`, or `~/.blogr` if that's unset.

- `workspace.json` holds workspaces, topics, articles, saved versions, and settings. It's versioned (`schemaVersion: 1`) and validated on every read and write.
- `media/` holds images. They're served by `/api/local/media/`, and images nothing references anymore are cleaned up automatically.

Writes are serialized and checked against a revision number, so an edit based on stale data is rejected instead of overwriting newer work. Each save writes a temporary file and renames it, so a failed save leaves the previous file intact. Run one server per `BLOGR_HOME`.

Rebuilding or reinstalling the app never touches `BLOGR_HOME`. Deleting that folder deletes your work, so keep a [backup](workspaces-and-backups.md).

## Modes and safety

`BLOGR_MODE` is `local-development`, `local-production`, or `test`. Any other value stops the server at startup.

The server binds to `127.0.0.1`. The local API only accepts loopback hosts, requires a same-origin `Origin` header on writes, limits request sizes, and returns `no-store`. Unexpected server errors are logged on the server, and the browser only gets a plain retry message. Outside image downloads block private network addresses, pin the checked address, limit redirects and size, and accept only real PNG, JPEG, GIF, or WebP files.

## Outside services (all optional)

Manual work runs offline: writing, editing, planning, quick fill, exports, and backups. Each of these features needs its own key in `.env.local`:

| Feature | Variable |
| --- | --- |
| AI writing, images, keyword ideas | `REPLICATE_API_TOKEN` (model choices: `REPLICATE_*_MODEL`) |
| Site scans, link refresh, article research | `FIRECRAWL_API_KEY` |
| Google research for topic ideas, AI fill, and briefs | `APIFY_TOKEN` |
| YouTube videos in articles | `YOUTUBE_API_KEY`, falls back to `EXA_API_KEY` |
| Publishing to your blog | `BLOG_PUBLISH_WEBHOOK_*`, see [publishing](publishing.md) |

## Project map

- `src/app/`: pages and API routes (`api/local/` for workspace data)
- `src/features/workspace/`: the whole interface (components, hooks, utils, types)
- `src/local/`: storage schema (`domain/`), file storage, mutations, and backups (`server/`), and client hooks (`client/`)
- `src/server/<area>/`: AI writing (`blog`), topic research (`topics`), scans (`product`, `firecrawl`), publishing, and other outside services
- `skills/blogr-publishing-receiver/`: the agent skill for building a receiving blog

## Checks

Run `npm test`, `npx tsc --noEmit --pretty false`, and `npm run lint`. Tests use `BLOGR_MODE=test` with a temporary `BLOGR_HOME`. Before changing `schemaVersion` or the backup `version`, add a migration and tests. Keep API keys in environment variables, never in the workspace file.
