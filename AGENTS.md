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

## Project Map
- App routes and layouts: `src/app/`
- Server helpers: `src/server/<domain>/`
- Convex functions and schema: `convex/`
- Feature docs: `docs/`
- Local setup and env vars: `README.md`
