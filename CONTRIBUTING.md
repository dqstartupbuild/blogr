# Contributing

Thanks for improving Blogr. Keep changes small, focused, and easy to review.

## Local Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

The app can run with demo data when service keys are missing. Live auth, data, research, images, storage, and publishing need the environment variables listed in `README.md`.

## Development Rules

- Use npm for package commands.
- Follow the atomic code splitting rules in `coding-guidelines.md`.
- Put new files in the closest relevant existing directory.
- Keep user-facing copy plain, human, and non-technical.
- Keep secrets in environment variables.
- Do not edit `convex/_generated/**` by hand.
- Document new features in a dedicated `docs/*.md` file.
- Update existing docs when behavior changes.

## Security Rules

- API routes should require a route user with `requireRouteUserId`.
- Use schema validation for request bodies.
- Use `PublicError` only for messages that are safe to show to users.
- Let unexpected server or provider errors use the generic public error message.
- Do not log passwords, tokens, API keys, webhook secrets, or raw private user data.
- Keep `AUTH_DISABLED_FOR_PREVIEW=false` outside local preview work.

## Before Opening a Pull Request

Run:

```bash
npm run lint
npx tsc --noEmit --pretty false
```

Also run `npm run build` when changing Next config, routing, server behavior, auth, Convex integration, or shared app structure.

## Pull Request Notes

In the PR description, include:

- What changed.
- Why it changed.
- How you tested it.
- Any new environment variables or setup steps.
- Any docs that were added or updated.
