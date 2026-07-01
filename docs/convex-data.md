# Convex Data

## What It Does

Convex stores product workspaces, blog generation settings, blog publishing integrations, R2 image keys, active workspace selections, saved topics, scheduled topic dates, topic dedupe metadata, generated blogs, list search metadata, blog tags, and component-managed product context embeddings.

## Tables

- `products`
- `workspaceSelections`
- `topics`
- `blogs`

The schema lives in `convex/schema.ts`.

`products` are the workspace records. Each product can include `blogGenerationSettings`, which stores the article style, writing rules, internal link count, associate brand links, image choices, and article extras for that workspace.

Each product can also include `blogPublishingIntegration`, which stores that product's webhook URL, access token, publisher label, enabled state, and update time. Public product queries sanitize this value and return `hasAccessToken` instead of the token. The publisher label is sent as the webhook payload's `source` value; it is not an article author.

Product scan images store R2 object keys in `assetKeys` and `productImageKeys`.

Product `siteLinks` include optional `isActive`. Missing values are active. Links marked inactive stay in the workspace but are excluded from topic discovery, blog writer context, and internal link selection.

Generated blog images can include an `r2Key` beside the served image URL. Blog and product queries use those keys to return fresh signed URLs from the Convex R2 component.

Topics and blogs can store `searchText` so list search can use Convex search indexes while still returning one paginated page at a time.

Topics can also store optional calendar fields:

- `scheduledDate`
- `sourceType`
- `canonicalKeyword`
- `intentKey`

The calendar uses these fields to plan one keyword per day for the next 30 days. Batch scheduling uses `intentKey` and canonical keywords to skip duplicates and avoid overwriting filled days.

Generated blogs store a visible article title and can store a separate `seoTitle`. Existing blogs without `seoTitle` fall back to the visible title in the UI. New generated posts normalize SEO titles to 70 to 110 characters and meta descriptions to 110 to 160 characters.

Generated blogs can store `tags`. Older blogs can omit this field, and publishing rebuilds clean fallback tags from the current blog fields.

The Convex RAG component stores scanned product context in a namespace based on the product workspace ID. Rescanning a product replaces the existing product context entry for that namespace, so future blog generation searches the latest scanned website context.

`workspaceSelections` stores one active product workspace per user. New topic and blog records include `productId`. Topic and blog list queries use user indexes, product filters, search indexes, and Convex pagination options so the UI can load 10 rows at a time.

Rows created before product workspaces can be backfilled with:

```bash
npx convex run migrations/backfillProductWorkspaceIds:backfillProductWorkspaceIds '{}' --identity '{"subject":"USER_ID"}'
```

## Auth

Convex functions call `requireUserId`, which checks Convex auth identity before reading or writing user data.

When `AUTH_DISABLED_FOR_PREVIEW=true` is set on the Convex deployment, signed-out preview traffic uses `preview-user`. This keeps branch previews usable without weakening normal Clerk-backed auth.

## Local Generated API Shim

This repo includes a small `convex/_generated` shim because no Convex deployment was configured during setup.

After connecting Convex, run:

```bash
npx convex dev
```

Convex will replace the shim with the normal generated files.

## Relevant Code

- `convex/schema.ts`
- `convex/identity/getPreviewUserId.ts`
- `convex/identity/requireUserId.ts`
- `convex/products/*`
- `convex/r2/*`
- `convex/rag/*`
- `convex/migrations/*`
- `convex/workspaceSelections/*`
- `convex/topics/*`
- `convex/blogs/*`
- `convex/_generated/*`

## Source References

- Convex Next.js route handler docs: https://docs.convex.dev/client/nextjs/app-router/server-rendering
- Convex Clerk docs: https://docs.convex.dev/auth/clerk
