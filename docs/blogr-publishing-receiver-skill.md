# Blogr Publishing Receiver Skill

## What It Does

The Blogr publishing receiver skill gives supported coding agents a focused workflow for adding the receiving side of Blogr publishing to a target app.

This first version only covers the stack we want to support now:

- Next.js App Router
- Convex article records
- Cloudflare R2 image storage

Other frameworks, databases, and storage providers can be added later as separate references instead of expanding the in-app prompt.

## How It Works

The skill lives in `codex-skills/blogr-publishing-receiver/`.

`SKILL.md` contains the short workflow and hard rules. It tells the coding agent to inspect the target repo, confirm that it is a Next.js App Router app, use Convex and R2, add the webhook route, copy images before saving articles, render Blogr MDX, add public blog pages, provide the deployment-safe repo ingestion workflow, test the integration, and finish with exact setup steps.

The detailed instructions are split into reference files:

- `contract.md` explains the webhook endpoint, auth, event shapes, article field mapping, and response behavior.
- `next-app-router.md` explains route placement, public blog pages, SEO, discovery outputs, cache refresh, env vars, and deployed-manifest repo resolution.
- `convex.md` explains canonical article records, summary records, indexes, `ConvexHttpClient` usage, and database-to-repo ownership states.
- `r2.md` explains safe image downloads, R2 env vars, object uploads, and image URL rewriting.
- `mdx-rendering.md` explains frontmatter, headings, table of contents links, images, sanitization, and YouTube embeds.
- `acceptance.md` explains fixtures, test coverage, verification commands, and final handoff requirements.

The fixture payloads live in `assets/fixtures/`:

- `publish-articles.json`
- `update-article.json`
- `publish-articles-multimedia.json`

The fixture image URLs use reserved domains. Target app tests should mock image downloads and assert that saved content uses target-owned R2 URLs or keys.

## Installing The Skill

To make `$blogr-publishing-receiver` discoverable in a local Codex environment, place the skill folder under the Codex skills directory:

```bash
mkdir -p ~/.codex/skills
cp -R codex-skills/blogr-publishing-receiver ~/.codex/skills/
```

The skill can also be symlinked during local development when you want Codex to read the repo-owned version directly.

## Integration Prompt

The in-app **Copy integration prompt** action produces the implementation brief.

The prompt works with any coding agent. If the agent supports skills and `$blogr-publishing-receiver` is installed, it can use the skill. Otherwise, it should continue with the complete fallback brief instead of stopping.

The fallback brief stays intentionally narrow. It names the endpoint, auth behavior, expected payload, Convex/R2 architecture, image copying rules, MDX rendering expectations, deployment-safe ingestion, test coverage, and final setup requirements without carrying every detailed reference inline.

## Repo Ingestion

Target apps can move published database articles into checked-in MDX with explicit batch commands: prepare with `npm run blogr:ingest` (which prints/persists a batch ID), then activate after commit and deployment with `npm run blogr:ingest -- --activate --batch=<batchId> --deployment-url=https://...`. Use `npm run blogr:ingest -- --abort --batch=<batchId>` to abandon a preparing/prepared batch safely. Prepare creates deterministic MDX, validates paths/frontmatter and collisions, stages writes atomically, and tracks independent resumable batches. Only when all pages succeed does that batch become prepared; preparing/prepared records remain database-served.

Activation verifies a schema-versioned manifest generated at build time from exact checked-in MDX bytes, never database/dynamic data. It is keyed by batch ID and validates every stable ID + repo path + SHA-256 tuple and each batch entry set/hash against the prepared export, accepts only `BLOG_REPO_DEPLOYMENT_ORIGIN` (a configured canonical/allowlisted HTTPS origin with no redirects or off-origin response), and uses one database compare-and-set to activate only the selected prepared batch. Multiple active batches coexist; public pages merge all active manifests and keep the database copy as fallback throughout rolling deploys and rollback. Discovery outputs merge deployed repo summaries and database summaries, deduplicated by stable ID then slug. No database record is removed automatically. Aborting a preparing/prepared batch detaches its records and restores database authority, while preserving generated files. Protected webhook payloads return actionable `409` before side effects; new-only payloads continue to publish normally. `BLOG_REPO_INGEST_SECRET` must be a long random non-committed secret set in authorized local/CI and Convex/server environments, unless the target already has an equivalent named admin/deploy mechanism.

## Why It Is Split This Way

The old prompt had to carry the whole implementation spec. That made it easier for target agents to miss late instructions or blend unrelated storage/framework advice.

The skill keeps the core workflow small and loads the relevant detail by topic. This should make target-app output more consistent while keeping the copyable prompt useful for users who do not have the skill installed.

## Relevant Code

- `src/features/workspace/utils/buildBlogPublishingIntegrationPrompt.ts`
- `src/features/workspace/components/BlogPublishingSetupGuide.tsx`
- `src/features/workspace/components/BlogPublishingReceiverDetails.tsx`
- `src/features/workspace/constants/publishing/blogPublishingPayloadExample.ts`
- `codex-skills/blogr-publishing-receiver/SKILL.md`
- `codex-skills/blogr-publishing-receiver/references/`
- `codex-skills/blogr-publishing-receiver/assets/fixtures/`
- `docs/target-app-blog-publishing-brief.md`
- `docs/blog-webhook-publishing.md`

## File Tree

```text
codex-skills/blogr-publishing-receiver/
  SKILL.md
  agents/openai.yaml
  references/
  assets/fixtures/
src/features/workspace/utils/buildBlogPublishingIntegrationPrompt.ts
docs/blogr-publishing-receiver-skill.md
docs/target-app-blog-publishing-brief.md
```
