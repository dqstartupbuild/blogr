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
- `convex/topics/*`
- `convex/blogs/*`
- `convex/_generated/*`

## Download Query

`getBlogForRoute` is used by the download API route as a fallback when the
server cannot mint Clerk's Convex token. The API route authenticates the Clerk
user first, then the Convex query returns the blog only when the passed user id
matches the blog owner.
- `src/server/convex/references/*`

## Source References

- Convex Next.js route handler docs: https://docs.convex.dev/client/nextjs/app-router/server-rendering
- Convex Clerk docs: https://docs.convex.dev/auth/clerk
