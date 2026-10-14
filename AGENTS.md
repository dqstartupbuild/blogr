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
- Keep `docs/` small: update the doc that covers the area you changed; add a new doc only for a major new area.
- Keep user-facing copy plain, human, and non-technical.
- Use `@/*` imports for `src/*` paths when that matches nearby code.

## Local-Only Rules
- Blogr runs only on the user's computer; there are no accounts, cloud database, or hosted deployment.
- Read and change workspace data through `src/local/` mutations so revision checks and validation apply.
- Keep API keys in environment variables, never in workspace data or backups.
- Outside services are optional: scanning, writing, and research may fail without keys, but manual workflows must keep working.

## Project Map
- App routes and layouts: `src/app/`
- Server helpers: `src/server/<domain>/`
- Local storage, schema, and backups: `src/local/`
- Docs: `docs/` (start with `docs/architecture.md`)
- Local setup and env vars: `README.md`
