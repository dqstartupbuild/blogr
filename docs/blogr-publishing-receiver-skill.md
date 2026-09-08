# Blogr Publishing Receiver Skill

## What It Does

`$blogr-publishing-receiver` helps a coding agent build, repair, or review the receiving side of Blogr publication. Its supported reference stack is:

- Next.js App Router
- Convex article and summary records
- Cloudflare R2 image storage
- optional deployment-safe database-to-repo article ingestion

The skill keeps narrower requests narrow. Repairing renderer security does not automatically add ingestion, and adding a webhook does not replace a target app's existing blog design or environment naming.

This repository contains the skill and the sender contract. It does not deploy a receiver into another app.

## Source Provenance

When the Blogr checkout is available, the skill tells agents to confirm the current sender shape in:

- `convex/products/blogPublishArticleValidator.ts`
- `convex/products/blogPublishPayloadValidator.ts`
- `convex/products/publishBlogWithIntegration.ts`
- `src/features/workspace/constants/publishing/blogPublishingPayloadExample.ts`
- `src/features/workspace/utils/buildBlogPublishingIntegrationPrompt.ts`
- `src/server/publishing/buildBlogPublishArticle.ts` and `src/server/publishing/getBlogPublishImageUrl.ts`

The sender includes `event_type`, `timestamp`, and `data`, and requires `content_html` alongside the Markdown/MDX fields. `content_html` is compatibility data and must not bypass safe rendering. Blogr allows 15 seconds for the complete webhook response.

These source paths belong to Blogr, not the target app. A fresh target installation uses the bundled contract and fixtures when it has no Blogr checkout.

Blogr can send an empty `image_url` when no feature image exists. The receiver skips that download and still handles body/frontmatter images.

## Task-Routed References

`SKILL.md` contains scope, routing, workflow, and cross-cutting invariants. It loads only the references needed for the current task:

- `contract.md`: envelope, field mapping, timing, identity, collisions, and response behavior
- `convex.md`: boundary authorization, atomic mutations, records, indexes, pagination, and read models
- `r2.md`: credentials, durable object references, private serving routes, SSRF controls, and cleanup
- `next-app-router.md`: route ownership, public pages, discovery, cache refresh, env setup, and deployment language
- `mdx-rendering.md`: untrusted MDX/HTML handling, controlled Markdown, heading IDs, and exact YouTube validation
- `repo-ingestion.md`: optional prepare, manifest proof, activation, fallback, abort, rollback, and revision cycle
- `acceptance.md`: fixtures, risk-focused tests, commands, and handoff requirements

A full install reads the complete receiver set. A renderer repair reads contract, Next.js, rendering, and acceptance. Repo ingestion is loaded only when requested.

## Key Guarantees

The guidance requires authorization at both the Next route and every callable Convex publishing/ingestion boundary, including permission for the target site. It uses one bounded final Convex mutation for ownership rechecks plus canonical and summary writes. R2 uploads happen before that transaction. Confirmed rejection cleans request-owned objects; an unknown commit outcome retains them until reconciliation proves they are unused. A cache-refresh failure cannot delete committed images.

Saved articles retain R2 object keys and stable same-origin routes, or explicitly permanent public URLs. They do not persist expiring presigned URLs or cache signed redirects past expiry. Remote downloads use an allowlist or validated public-address strategy with connection binding, redirect, IP-range, streaming-size, MIME, timeout, and SVG controls.

Received MDX is never compiled as trusted JavaScript. The renderer supports a controlled Markdown/YouTube subset and applies the same restrictions to repo-exported files.

Stable Blogr source ID wins. Slug fallback is for legacy records without a source ID. The requested slug is checked even when the ID matches; another canonical record on that slug and duplicate incoming IDs/slugs are rejected.

## Repo Ingestion

Optional ingestion tracks independent `preparing | prepared | active | rolled_back | aborted` batches. Preparation creates deterministic MDX and SHA-256 revisions. Activation trusts only a statically built deployed manifest from the configured HTTPS origin. Multiple active batches coexist, and retained database content is the fallback when an exact artifact is absent.

Each exported page is claimed with a database revision comparison, and preparation rechecks the full claimed revision set. This prevents an intervening webhook update from activating a stale export. Manifest and runtime content share the exact build artifact; activation and rollback refresh cached authority and discovery decisions.

Editing and committing an active repo file changes its SHA-256 and does not activate that revision. The supported workflow is rollback or abort, republish through Blogr, prepare a new batch, deploy it, then activate it after manifest proof.

## Fixtures And Validation

Fixtures live in `assets/fixtures/`:

- `publish-articles.json`
- `update-article.json`
- `publish-articles-multimedia.json`

Validation for skill changes includes the system `quick_validate.py`, YAML and relative-link checks, JSON parsing, fixture-to-validator field checks, TODO-scaffold checks, and lint/typecheck when the copied TypeScript prompt changes.

## Installing The Skill

The generated integration prompt tells the receiving coding agent to download the complete [`codex-skills/blogr-publishing-receiver/`](https://github.com/dqstartupbuild/blogr/tree/main/codex-skills/blogr-publishing-receiver) folder before changing the target app. The agent installs or copies the folder into its supported skills directory, keeps the references and fixtures beside `SKILL.md`, reads the entrypoint, and invokes `$blogr-publishing-receiver`.

If the agent cannot access or install skills, it continues with the complete fallback brief embedded in the prompt. The folder name and invocation remain stable so installed copies stay discoverable.

## Authoritative References

Provider and security links live beside the decisions they support. The main sources are [Convex App Router usage](https://docs.convex.dev/client/nextjs/app-router/server-rendering), [Convex mutations](https://docs.convex.dev/functions/mutation-functions), [Convex function auth](https://docs.convex.dev/auth/functions-auth), [Cloudflare R2 credentials](https://developers.cloudflare.com/r2/api/tokens/), [Cloudflare R2 presigned URLs](https://developers.cloudflare.com/r2/api/s3/presigned-urls/), [Next.js MDX compilation](https://nextjs.org/docs/app/guides/mdx), [react-markdown](https://github.com/remarkjs/react-markdown), [rehype-sanitize](https://github.com/rehypejs/rehype-sanitize), and [OWASP SSRF prevention](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html).

## File Tree

```text
codex-skills/blogr-publishing-receiver/
  SKILL.md
  agents/openai.yaml
  references/
    contract.md
    convex.md
    r2.md
    next-app-router.md
    mdx-rendering.md
    repo-ingestion.md
    acceptance.md
  assets/fixtures/
    publish-articles.json
    update-article.json
    publish-articles-multimedia.json
src/features/workspace/utils/buildBlogPublishingIntegrationPrompt.ts
src/features/workspace/utils/buildBlogPublishingIntegrationPrompt.test.ts
src/features/workspace/constants/publishing/blogPublishingReceiverSkillUrl.ts
docs/blogr-publishing-receiver-skill.md
docs/target-app-blog-publishing-brief.md
docs/blog-webhook-publishing.md
```
