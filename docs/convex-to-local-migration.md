# Migrate a verified Convex account to this computer

## Purpose and result

The offline migration command converts one verified Clerk owner's Convex records and downloaded R2 images into a new local staging directory. It preserves project, topic, article, article-version, and workspace-selection relationships; source timestamps and scan time; publishing URL and source settings; and article text. Old Convex IDs become deterministic UUIDs, so the same export gives the same local IDs on repeated runs. The local app derives summaries and search options from these canonical records.

The command does not sign into Clerk, contact Convex or R2, download images, or modify `BLOGR_HOME`. Obtain the export and media through separately authorized access. Verify the account's Clerk user ID before choosing `--owner-id`. Do not infer ownership from an email address or use another account's records when the requested address does not match.

## Input and command

The input is either a Convex export ZIP with `<table>/documents.jsonl` entries or a directory containing those entries or flat `<table>.jsonl` files. Required tables are `products`, `topics`, `blogs`, and `blogVersions`; `workspaceSelections` and `aiJobs` are optional. The media manifest is an array of `{ "r2Key": "...", "file": "downloaded-media/example.png", "sourceUrl": "optional signed URL" }`. Each file path is relative to the manifest, and all referenced media must be downloaded first. Multiple signed URLs can name the same key and file.

1. Keep the original ZIP and downloaded media outside the repository.
2. Run `npm run migrate:convex -- --input /absolute/path/export.zip --media-manifest /absolute/path/media-manifest.json --output /absolute/path/new-staging-home --owner-id user_verified_id`.
3. Compare `migration-report.json` counts with the source export. Inspect `workspace.json`, images in `media/`, and the optional archive. The output path must be new and outside the repository.
4. After owner verification and review, start Blogger with `BLOGR_HOME` pointing to the reviewed staging directory. If an existing local home contains work, export it first and decide how to retain both copies; do not replace it implicitly.

The staging folder contains `workspace.json` with canonical schema version 1, `media/` with locally served referenced images, `archive/ai-jobs.json` with sanitized historical job inputs/results, `archive/unreferenced-media/` with downloaded R2 objects under the verified owner's sanitized key prefix that no live record uses, `archive/unreferenced-media-manifest.json` with only the key suffix after that prefix, and `migration-report.json`. Unreferenced entries from other owner prefixes are skipped and counted in the report; an image explicitly referenced by one of the selected owner's records is allowed even if its key has a different prefix. AI jobs have no live status screen; their history remains available only in the archive. The usual Settings backup covers live workspace records and referenced media, not the migration archive. Retain the original export and a separate copy of `archive/` if historical job outputs and unused objects matter.

## Media and credentials

Product image arrays, article and version image objects, feature images, and MDX references to signed R2 URLs are rewritten to local media paths. Repeated signed URLs for one key share one local file. Source image bytes are checked for a recognized raster format. An image without a downloaded file blocks the migration instead of leaving a broken managed reference. Unrelated external URLs remain external. A raw website scan may contain an embedded image proxy to an R2 object outside the account export; its expired signed URL is replaced with an `r2-key:` reference and counted in the report.

Clerk IDs, webhook tokens, provider API keys, signed image query strings, and credentials are excluded from the local workspace and migration archive. The source account's publishing URLs and enabled states are retained, but `hasAccessToken` is derived from local environment configuration. Set `BLOG_PUBLISH_WEBHOOK_TOKENS` in an ignored `.env.local` file to a JSON object mapping local product UUIDs from `migration-report.json` to their respective tokens. `BLOG_PUBLISH_WEBHOOK_TOKEN` is a fallback when no project-specific token exists. Keep these values out of Git and backups. A remote publishing receiver cannot fetch local media paths; export and upload article images to the receiver before publishing articles that use them.

## Maintenance

`src/local/migration/` holds the export reader, per-record mappers, media rewrite, secret-safe job archive, and staging writer. `scripts/migration/convex-to-local.ts` is the command entry. The canonical validator in `src/local/domain/localStateSchema.ts` rejects broken ownership relationships, duplicate IDs, and invalid fields before writing. The staging writer refuses an existing path and removes its newly created directory if writing fails. Keep mapping tests and backup limits in step with any future schema changes.
