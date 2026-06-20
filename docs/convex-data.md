# Convex Data

## What It Does

Convex stores product profiles, saved topics, and generated blogs.

## Tables

- `products`
- `topics`
- `blogs`

The schema lives in `convex/schema.ts`.

## Auth

Convex functions call `requireUserId`, which checks Convex auth identity before reading or writing user data.

## Local Generated API Shim

This repo includes a small `convex/_generated` shim because no Convex deployment was configured during setup.

After connecting Convex, run:

```bash
npx convex dev
```

Convex will replace the shim with the normal generated files.

## Relevant Code

- `convex/schema.ts`
- `convex/identity/requireUserId.ts`
- `convex/products/*`
- `convex/topics/*`
- `convex/blogs/*`
- `convex/_generated/*`
- `src/server/convex/references/*`

## Source References

- Convex Next.js route handler docs: https://docs.convex.dev/client/nextjs/app-router/server-rendering
- Convex Clerk docs: https://docs.convex.dev/auth/clerk
