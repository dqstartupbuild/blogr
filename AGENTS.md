# Agent Instructions

## Package Manager
- Use **npm**: `npm install`, `npm run dev`, `npm run build`, `npm run lint`

## File-Scoped Commands
| Task | Command |
|------|---------|
| Lint file | `npm run lint -- path/to/file.tsx` |
| Typecheck project | `npx tsc --noEmit --pretty false` |

## Next.js
- This repo uses Next `16.2.9` App Router, not legacy Next.js assumptions.
- Before changing Next behavior, read the relevant guide in `node_modules/next/dist/docs/`.
- Start App Router context at `node_modules/next/dist/docs/01-app/index.md`.

## Key Conventions
- Follow `coding-guidelines.md`: one file, one purpose; split components, functions, and types by responsibility.
- Add new files under the closest relevant directory; avoid root-level implementation files.
- Document new features in a dedicated `docs/*.md`; update existing docs when behavior changes.
- Keep user-facing copy plain, human, and non-technical.
- Use `@/*` imports for `src/*` paths when that matches nearby code.
- Do not edit `convex/_generated/**` directly.

## Auth and Convex Token Rules
- API routes should call `requireRouteUserId` for route protection, but should not request Clerk's Convex JWT before doing slow or primary non-Convex work.
- Only request a Convex auth token as non-blocking setup or at the point where a required Convex server call is made. If the Convex call is optional enhancement work, such as RAG indexing/search, use `getOptionalConvexAuthToken` and let the main route continue when token minting or the Convex action fails.
- For image storage in long-running routes, pass the route-verified user ID into R2 helpers. If Convex auth is unavailable, store directly in R2 with that user ID instead of calling a Convex action without a token.
- Do not make scanning, writing, research, or other core generation flows fail just because an optional server-side Convex action cannot get a token.

## Project Map
- App routes and layouts: `src/app/`
- Server helpers: `src/server/<domain>/`
- Convex functions and schema: `convex/`
- Feature docs: `docs/`
- Local setup and env vars: `README.md`
