# Convex Data

## What It Does

Convex stores product workspaces, blog generation settings, R2 image keys, active workspace selections, saved topics, generated blogs, and component-managed product context embeddings.

## Tables

- `products`
- `workspaceSelections`
- `topics`
- `blogs`

The schema lives in `convex/schema.ts`.

`products` are the workspace records. Each product can include `blogGenerationSettings`, which stores the article style, writing rules, internal link count, image choices, and article extras for that workspace. Product scan images store R2 object keys in `assetKeys` and `productImageKeys`.

Generated blog images can include an `r2Key` beside the served image URL. Blog and product queries use those keys to return fresh signed URLs from the Convex R2 component.

The Convex RAG component stores scanned product context in a namespace based on the product workspace ID. Rescanning a product replaces the existing product context entry for that namespace, so future blog generation searches the latest scanned website context.

`workspaceSelections` stores one active product workspace per user. New topic and blog records include `productId`, and list queries use product-scoped indexes so one workspace does not read another workspace's records.

Topic and blog list queries tolerate a stale workspace ID from the browser by falling back to the user's current saved workspace. Mutations still verify the requested workspace before writing.

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
