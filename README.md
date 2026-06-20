# Blogger

Blogger is a simple Next.js workspace for turning saved keywords into longform MDX blog posts for a user's niche.

The app uses Clerk for auth, Convex for data, Firecrawl for website and web research, and Replicate for the writer and image models.

## Local Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Without keys, the workspace shows a local demo layout. With Clerk and Convex public env vars set, it switches to the live workspace.

## Credentials Needed

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `CLERK_JWT_ISSUER_DOMAIN`
- `NEXT_PUBLIC_CONVEX_URL`
- `REPLICATE_API_TOKEN`
- `REPLICATE_WRITER_MODEL`
- `REPLICATE_IMAGE_MODEL`
- `FIRECRAWL_API_KEY`
- `YOUTUBE_API_KEY` optional

Set `AUTH_DISABLED_FOR_PREVIEW=true` only for local preview work. Keep it false in production.

## Convex Setup

Run this after creating the Convex project:

```bash
npx convex dev
```

This will replace the local `convex/_generated` shim with the fully typed generated API.

## Feature Docs

- [Product website ingestion](docs/product-website-ingestion.md)
- [Topic workspace](docs/topic-workspace.md)
- [Blog generation workflow](docs/blog-generation-workflow.md)
- [Blog editor](docs/blog-editor.md)
- [Zip export](docs/zip-export.md)
- [Auth](docs/auth.md)
- [Convex data](docs/convex-data.md)
