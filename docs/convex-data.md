# Convex Data

## What It Does

Convex stores product workspaces, blog generation settings, active workspace selections, saved topics, and generated blogs.

## Tables

- `products`
- `workspaceSelections`
- `topics`
- `blogs`

The schema lives in `convex/schema.ts`.

`products` are the workspace records. Each product can include `blogGenerationSettings`, which stores the article style, writing rules, internal link count, image choices, and article extras for that workspace. `workspaceSelections` stores one active product workspace per user. New topic and blog records include `productId`, and list queries use product-scoped indexes so one workspace does not read another workspace's records.

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
- `convex/migrations/*`
- `convex/workspaceSelections/*`
- `convex/topics/*`
- `convex/blogs/*`
- `convex/_generated/*`

## Source References

- Convex Next.js route handler docs: https://docs.convex.dev/client/nextjs/app-router/server-rendering
- Convex Clerk docs: https://docs.convex.dev/auth/clerk
