# Blogr

Blogr is a simple Next.js workspace for turning saved keywords into longform MDX blog posts for a user's niche.

The app uses Clerk for auth, Convex for data, Firecrawl for website and web research, Apify for Google topic discovery, Replicate for the writer and image models, Cloudflare R2 for stored images, and OpenAI embeddings for product context retrieval.

## Project

- [MIT license](LICENSE)
- [Security policy](SECURITY.md)
- [Contributing guide](CONTRIBUTING.md)

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
- `REPLICATE_IMAGE_PLANNER_MODEL`
- `REPLICATE_IMAGE_MODEL`
- `OPENAI_API_KEY` for Convex RAG embeddings
- `FIRECRAWL_API_KEY`
- `APIFY_TOKEN`
- `YOUTUBE_API_KEY` optional
- `EXA_API_KEY` optional video search fallback
- `BLOG_PUBLISH_WEBHOOK_URL` optional fallback blog publishing destination
- `BLOG_PUBLISH_WEBHOOK_TOKEN` optional fallback blog publishing token
- `BLOG_PUBLISH_SOURCE_NAME` optional fallback publishing source label
- `BLOG_PUBLISH_TIMEOUT_MS` optional publishing request timeout

Set `AUTH_DISABLED_FOR_PREVIEW=true` only for local preview work. Keep it false in production.

Blog publishing is normally configured per product from the Settings tab. The blog publishing env vars are only needed when you want one deployment-level fallback destination.

## Convex Setup

Run this after creating the Convex project:

```bash
npx convex dev
```

This will replace the local `convex/_generated` shim with the fully typed generated API.

Set component credentials on the Convex deployment when using stored images or product context retrieval. The same R2 credentials also need to exist on the Vercel/Next.js deployment so long-running routes can store generated images directly when Convex auth is unavailable:

```bash
npx convex env set OPENAI_API_KEY <openai-api-key>
npx convex env set R2_TOKEN <token>
npx convex env set R2_ACCESS_KEY_ID <access-key-id>
npx convex env set R2_SECRET_ACCESS_KEY <secret-access-key>
npx convex env set R2_ENDPOINT <endpoint>
npx convex env set R2_BUCKET <bucket>
```

## Feature Docs

- [Product website ingestion](docs/product-website-ingestion.md)
- [Product link management](docs/product-link-management.md)
- [Topic workspace](docs/topic-workspace.md)
- [Topic discovery](docs/topic-discovery.md)
- [Blog generation workflow](docs/blog-generation-workflow.md)
- [Associate brand links](docs/associate-brand-links.md)
- [Article image planning agent](docs/article-image-planning-agent.md)
- [RAG product context](docs/rag-product-context.md)
- [Blog generation reliability](docs/blog-generation-reliability.md)
- [Blog editor](docs/blog-editor.md)
- [Blog webhook publishing](docs/blog-webhook-publishing.md)
- [Codex target app blog webhook brief](docs/codex-target-app-blog-webhook.md)
- [Zip export](docs/zip-export.md)
- [Auth](docs/auth.md)
- [Convex data](docs/convex-data.md)
- [Security hardening](docs/security-hardening.md)
- [Theme](docs/theme.md)

The in-app version of the publishing setup guide is available from **Settings** > **Publishing** for the active product.
