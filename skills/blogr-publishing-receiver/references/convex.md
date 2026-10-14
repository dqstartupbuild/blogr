# Convex Records

## Client And Function Boundary

The Next route may use a request-scoped `ConvexHttpClient` with the normal `.convex.cloud` deployment URL, or the target's existing `convex/nextjs` server helpers. The [Convex App Router guide](https://docs.convex.dev/client/nextjs/app-router/server-rendering) covers Route Handler calls, and the [`ConvexHttpClient` API](https://docs.convex.dev/api/classes/browser.ConvexHttpClient) documents server-side credentials and public query/mutation calls.

Do not use `.convex.site`, `CONVEX_SITE_URL`, or `NEXT_PUBLIC_CONVEX_SITE_URL` for Blogr publication. Preserve `CONVEX_URL` or `NEXT_PUBLIC_CONVEX_URL` when the target already uses it.

Every callable publishing and ingestion function must authorize at the Convex boundary unless it is an intentionally public read exposing published fields only. Checking `BLOG_PUBLISH_WEBHOOK_TOKEN` only in the Next route leaves a direct-call bypass. Prefer the target's existing server identity/JWT or admin authorization. Otherwise:

- create a dedicated server-to-Convex secret such as `BLOG_PUBLISH_CONVEX_SECRET`
- set it in both the hosting/server environment and the Convex environment
- pass it only server-to-server
- check it in every externally callable publishing or ingestion function before reading or writing protected data
- never expose it to browser bundles, logs, command arguments, or public docs containing real values

Use `ctx.auth.getUserIdentity()` when an established authenticated identity is suitable; see [Convex function authentication](https://docs.convex.dev/auth/functions-auth). An external `ConvexHttpClient` cannot call an `internalMutation`. Use an authenticated public callable wrapper whose mutation performs the bounded transaction, rather than documenting an impossible direct internal-function call.

Authorize the identity's publishing/admin permission for the target site; a non-null identity alone is insufficient. `setAuth()` expects an identity JWT, not an arbitrary shared secret. When using the secret alternative, require a non-empty configured expected value and a validated secret argument, and compare them inside each protected function. Fail closed when configuration is absent.

## Canonical And Summary Records

Create or reuse a canonical article record with equivalents of:

- `sourceId`, `title`, `seoTitle`, `slug`, and `description`
- `contentMdx`, `featureImageKey` or durable serving URL, `tags`, and `source`
- `publishedAt` and `updatedAt`
- optional repo fields: `ingestionBatchId`, `repoPath`, and `repoRevisionSha256`

Use indexed lookups for `sourceId` and `slug`; see [Convex indexes](https://docs.convex.dev/database/reading-data/indexes/). Stable source ID wins. Slug fallback applies only to legacy rows without a source ID. Reject a slug collision with a different established source ID.

Repeated discovery queries should read a lightweight summary table that excludes body MDX and large arrays. Returning selected fields after loading a full canonical document does not reduce the underlying database read. Keep summary rows synchronized in the same mutation as canonical records.

Use cursor pagination for potentially large exports and lists; see [Convex pagination](https://docs.convex.dev/database/pagination).

## Atomic Webhook Mutation

R2 I/O happens before the final database mutation and cannot be part of a Convex transaction. Bound the accepted webhook article count so the final operation fits one mutation.

That mutation must:

1. reject duplicate incoming IDs/slugs and recheck source-ID, requested-slug collision, and repo-batch ownership for every normalized article, even when an ID match exists
2. fail the entire accepted batch if any check fails
3. upsert every canonical article
4. upsert every summary/read-model row
5. commit all database changes together

Convex mutations are transactional; see [mutation transaction behavior](https://docs.convex.dev/functions/mutation-functions). Do not claim atomicity when looping over separate client mutation calls.

A client timeout can leave the commit outcome unknown. Use an authorized operation/reservation status when reconciling it; never infer that uploaded objects are unused from a network error or cache-refresh failure. Preserve committed image references.

Public queries may return published data only. Protected ownership preflights, publishing, prepare, activate, abort, rollback, and administrative export functions require boundary authorization even if the Next route is already protected.

## Repo State

When repo ingestion is requested, follow [repo-ingestion.md](repo-ingestion.md). Keep independent batch records with `preparing | prepared | active | rolled_back | aborted` status. Authority derives from the referenced batch status, not an independently mutable article flag. One source ID or slug cannot belong to multiple non-terminal batches.

Protect export, prepare completion, activation, abort, and rollback functions. Activation is one compare-and-set mutation on the selected prepared batch. Activating one batch must not deactivate other active batches.

## Tests And Deployment

Use [convex-test](https://docs.convex.dev/testing/convex-test) when it fits the target repo. Cover missing/invalid direct-call authorization, batch atomicity, ID/slug collisions, protected ownership, summary synchronization, and pagination.

Inspect the target's actual Convex deployment state. Code generation and development pushes are not production deployment. This Blogr repository currently has no production Convex deployment, and editing this skill requires no schema or function push.
