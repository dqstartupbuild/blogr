# Deployment-Safe Repo Ingestion

Read this reference only when the user requests database-to-repo ingestion, activation, rollback, or a review of that workflow. Receiving and rendering Blogr articles does not require this capability.

## Commands And Authority

Provide explicit user-run commands shaped like:

```bash
npm run blogr:ingest -- --dry-run
npm run blogr:ingest
npm run blogr:ingest -- --activate --batch=<batchId> --deployment-url=https://your-site.example
npm run blogr:ingest -- --abort --batch=<batchId>
npm run blogr:ingest -- --rollback --batch=<batchId>
```

Prepare supports all published records by default and explicit stable-ID/slug targets. It prints and persists the batch ID. Secrets come from the environment, never arguments.

A batch has an immutable ID, schema version, deterministic ordered entry set, entry-set hash, and one status: `preparing`, `prepared`, `active`, `rolled_back`, or `aborted`. Articles and summaries reference their batch ID, repo path, and exact SHA-256 revision. Authority derives from batch status:

- `preparing` and `prepared`: database remains authoritative
- `active`: repo is authoritative only when the deployed exact artifact exists; otherwise database fallback remains authoritative
- `rolled_back` and `aborted`: database is authoritative

Batches are independent. Activating batch B must not deactivate active batch A. A source ID or slug cannot belong to two non-terminal batches.

## Prepare

Use authenticated, cursor-paginated export queries. Create or resume one `preparing` batch. For every record:

- recheck source-ID and slug ownership
- serialize deterministic frontmatter and the controlled Markdown subset with no volatile export timestamp
- preserve SEO fields and stable target-owned image routes/keys
- compute SHA-256 from the exact final file bytes
- derive a safe managed path and reject traversal, case-folding collisions, duplicate IDs/slugs, and managed/unmanaged collisions
- never export binary media

Before accepting each exported page, use an authorized mutation to claim its exact source IDs/slugs and compare the exported database revisions with current canonical revisions. Store those revisions on the batch entries and attach article/summary ownership to the preparing batch in the same transaction. Reject or re-export a changed record instead of locking a stale snapshot. All article-write paths must respect these claims. At prepare completion, recheck the complete claimed entry set and revisions before marking it prepared. Pagination alone does not give a stable database snapshot across requests.

Stage the entire intended file set in a temporary directory. Validate every page, file, revision, and the complete ordered entry set before atomically installing managed files and marking the batch `prepared`. If the target filesystem cannot provide the required atomic boundary, document and test a recoverable staged strategy without claiming stronger atomicity.

Preparation may persist resumable page progress, but partial work exits nonzero and never gains repo authority. A zero-diff rerun for the same preparing batch is idempotent. `--dry-run` writes no repo or database state.

Never overwrite unmanaged paths, delete database content, prune old files, commit, push, or deploy.

## Static Deployment Proof

The target build creates a schema-versioned manifest only from exact checked-in article bytes. It must not query Convex or other dynamic data. Key entries by batch ID and include each stable source ID, slug, repo path, and SHA-256 revision plus the deterministic batch entry-set hash.

Activation accepts only the configured `BLOG_REPO_DEPLOYMENT_ORIGIN`:

- canonical or explicitly allowlisted HTTPS origin
- no URL credentials
- no redirects
- no off-origin response
- no arbitrary caller-selected origin

Fetch the manifest at a fixed path from that origin, require a successful bounded response, and validate schema version, batch ID, every tuple, exact entry set, and entry-set hash.

Local files, a commit hash, or a successful deploy command are not proof that the expected bytes are serving.

## Activation, Abort, And Rollback

Protect every export and state-changing Convex function at the Convex boundary. Use the target's existing admin/deploy identity or `BLOG_REPO_INGEST_SECRET`, set in the authorized local/CI environment and Convex/server environment. Do not expose it in browser code, logs, or argv.

Activation is one compare-and-set mutation. It changes only the selected batch from `prepared` to `active` when the stored schema/version and entry set/hash still match the verified deployed manifest. Failure leaves database authority unchanged.

Abort accepts only `preparing` or `prepared`, detaches its article/summary references, and marks that batch `aborted`. Rollback accepts only `active` and marks just that batch `rolled_back`. Both retain database records, repo metadata, and generated files for explicit later cleanup.

## Public Resolution

For a record in an active batch, serve repo content only when its deployed manifest entry and exact file SHA-256 match the stored revision. Otherwise serve retained database content. Merge summaries from all active deployed manifests with database summaries for index, sitemap, feed, search, tags, related posts, and static params. Deduplicate by stable source ID, then slug. Omit the database copy only when the matching deployed artifact is present.

This fallback is required for first deploys, rolling deploys, missing artifacts, failed activation, and rollback.

## Revising Repo-Owned Content

A direct edit changes the file SHA-256. A commit and deployment alone therefore causes the resolver to fall back to the retained database record; it does not activate the edit.

Generate runtime content and the manifest from the same build artifact so a changed file cannot carry a stale manifest hash. Activation and rollback must refresh cached article, discovery, and batch-authority reads; otherwise a previously cached database or repo decision can outlive the state change.

The supported revision cycle is:

1. roll back the active batch, or abort a not-yet-active batch
2. republish the article through Blogr so the database holds the new canonical content
3. prepare a new batch/revision
4. commit and deploy the generated files
5. activate the new prepared batch after manifest verification

A direct-repo-edit workflow needs a separate authenticated revision-registration and activation design. Do not invent it silently.

## Tests

Cover dry-run, pagination failure, resumable preparation, zero-diff rerun, path/collision rejection, concurrent batches, exact manifest proof, origin/redirect rejection, compare-and-set activation, database fallback, deduplication, abort, rollback, and revision mismatch.
