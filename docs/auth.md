# Auth

## What It Does

Clerk protects API routes and provides sign-in controls.

The workspace can still be viewed without keys because it falls back to demo data until Clerk and Convex public env vars are set.

## How It Works

`src/proxy.ts` uses Clerk middleware when Clerk keys exist. It protects `/api/*` routes unless `AUTH_DISABLED_FOR_PREVIEW=true`.

Every API route also calls `requireRouteUserId`, so route protection does not depend only on proxy behavior.

Preview deployments can be opened without signing in when `AUTH_DISABLED_FOR_PREVIEW=true` is set in both Vercel and Convex. The server routes use `preview-user`, and the workspace page forces demo mode so the browser does not wait on Clerk or Convex auth during layout review.

When real login is enabled, workspace data and the blog editor both wait for Convex auth, not just Clerk auth. That prevents live Convex queries from running before the browser has a valid Convex token.

Server routes also request Clerk's `convex` token template before calling Convex.

The app has Clerk sign-in and sign-up routes:

- `/sign-in`
- `/sign-up`

## Relevant Code

- `src/proxy.ts`
- `src/app/providers.tsx`
- `src/app/sign-in/[[...sign-in]]/page.tsx`
- `src/app/sign-up/[[...sign-up]]/page.tsx`
- `src/features/auth/components/AuthActions.tsx`
- `src/features/workspace/components/LiveBlogEditorView.tsx`
- `src/server/auth/requireRouteUserId.ts`
- `src/server/auth/getConvexAuthToken.ts`
- `convex/identity/getPreviewUserId.ts`
- `convex/identity/requireUserId.ts`

## Source References

- Clerk Next.js proxy docs: https://clerk.com/docs/reference/nextjs/clerk-middleware
- Convex Clerk docs: https://docs.convex.dev/auth/clerk
