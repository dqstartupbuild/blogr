# Auth

## What It Does

Clerk protects API routes and provides sign-in controls.

The workspace can still be viewed without keys because it falls back to demo data until Clerk and Convex public env vars are set.

## How It Works

`src/proxy.ts` uses Clerk middleware when Clerk keys exist. It protects `/api/*` routes unless `AUTH_DISABLED_FOR_PREVIEW=true`.

Every API route also calls `requireRouteUserId`, so route protection does not depend only on proxy behavior.

The app has Clerk sign-in and sign-up routes:

- `/sign-in`
- `/sign-up`

## Relevant Code

- `src/proxy.ts`
- `src/app/providers.tsx`
- `src/app/sign-in/[[...sign-in]]/page.tsx`
- `src/app/sign-up/[[...sign-up]]/page.tsx`
- `src/features/auth/components/AuthActions.tsx`
- `src/server/auth/requireRouteUserId.ts`
- `src/server/auth/getConvexAuthToken.ts`

## Source References

- Clerk Next.js proxy docs: https://clerk.com/docs/reference/nextjs/clerk-middleware
- Convex Clerk docs: https://docs.convex.dev/auth/clerk
