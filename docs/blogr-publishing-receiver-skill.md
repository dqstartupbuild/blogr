# Blogr Publishing Receiver Skill

## What It Does

The Blogr publishing receiver skill gives Codex a focused workflow for adding the receiving side of Blogr publishing to a target app.

This first version only covers the stack we want to support now:

- Next.js App Router
- Convex article records
- Cloudflare R2 image storage

Other frameworks, databases, and storage providers can be added later as separate references instead of expanding the in-app prompt.

## How It Works

The skill lives in `codex-skills/blogr-publishing-receiver/`.

`SKILL.md` contains the short workflow and hard rules. It tells Codex to inspect the target repo, confirm that it is a Next.js App Router app, use Convex and R2, add the webhook route, copy images before saving articles, render Blogr MDX, add public blog pages, test the integration, and finish with exact setup steps.

The detailed instructions are split into reference files:

- `contract.md` explains the webhook endpoint, auth, event shapes, article field mapping, and response behavior.
- `next-app-router.md` explains route placement, public blog pages, SEO, discovery outputs, cache refresh, and env vars.
- `convex.md` explains canonical article records, summary records, indexes, and `ConvexHttpClient` usage.
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

## Copyable Prompt

The in-app **Copy Codex prompt** action now produces a shorter prompt.

The prompt asks Codex to use `$blogr-publishing-receiver` when the skill is installed. If it is not installed, Codex should continue with the fallback brief in the prompt instead of stopping.

The fallback brief stays intentionally narrow. It names the endpoint, auth behavior, expected payload, Convex/R2 architecture, image copying rules, MDX rendering expectations, test coverage, and final setup requirements without carrying every detailed reference inline.

## Why It Is Split This Way

The old prompt had to carry the whole implementation spec. That made it easier for target agents to miss late instructions or blend unrelated storage/framework advice.

The skill keeps the core workflow small and loads the relevant detail by topic. This should make target-app output more consistent while keeping the copyable prompt useful for users who do not have the skill installed.

## Relevant Code

- `src/features/workspace/utils/buildBlogPublishingCodexPrompt.ts`
- `src/features/workspace/components/BlogPublishingSetupGuide.tsx`
- `src/features/workspace/components/BlogPublishingReceiverDetails.tsx`
- `src/features/workspace/constants/publishing/blogPublishingPayloadExample.ts`
- `codex-skills/blogr-publishing-receiver/SKILL.md`
- `codex-skills/blogr-publishing-receiver/references/`
- `codex-skills/blogr-publishing-receiver/assets/fixtures/`
- `docs/codex-target-app-blog-webhook.md`
- `docs/blog-webhook-publishing.md`

## File Tree

```text
codex-skills/blogr-publishing-receiver/
  SKILL.md
  agents/openai.yaml
  references/
  assets/fixtures/
src/features/workspace/utils/buildBlogPublishingCodexPrompt.ts
docs/blogr-publishing-receiver-skill.md
docs/codex-target-app-blog-webhook.md
```
