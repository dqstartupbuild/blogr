---
name: blogr-publishing-receiver
description: Build, repair, or review a Blogr publishing receiver in a Next.js App Router app using Convex records and Cloudflare R2 images, including the optional deployment-safe database-to-repo ingestion workflow. Use for Blogr webhooks, POST /api/webhooks/blog-publisher, Blogr article rendering, or Blogr repo ingestion; do not use for unrelated publishing systems.
---

# Blogr Publishing Receiver

Add the receiving side of Blogr publishing without replacing the target app's existing architecture. The supported reference stack is Next.js App Router, Convex, and Cloudflare R2.

Respect narrower requests. A webhook or renderer repair does not authorize adding repo ingestion, replacing storage, changing deployment providers, or redesigning the public blog. If the target uses another stack, explain which contract and safety rules still apply, then adapt only within the user's requested scope.

## Route References By Task

Read each selected reference completely before editing:

- Receiver without repo ingestion: [contract](references/contract.md), [Convex](references/convex.md), [R2](references/r2.md), [Next.js App Router](references/next-app-router.md), [safe MDX rendering](references/mdx-rendering.md), and [acceptance](references/acceptance.md).
- Full receiver including repo ingestion: read the receiver set above plus [repo ingestion](references/repo-ingestion.md).
- Contract, auth, upsert, or webhook repair: [contract](references/contract.md), [Convex](references/convex.md), and [acceptance](references/acceptance.md). Add [R2](references/r2.md) when images are involved.
- Public blog or renderer repair: [contract](references/contract.md), [Next.js App Router](references/next-app-router.md), [safe MDX rendering](references/mdx-rendering.md), and [acceptance](references/acceptance.md).
- R2 image durability or download repair: [contract](references/contract.md), [R2](references/r2.md), and [acceptance](references/acceptance.md).
- Optional database-to-repo ingestion: [repo ingestion](references/repo-ingestion.md), [Convex](references/convex.md), [Next.js App Router](references/next-app-router.md), [safe MDX rendering](references/mdx-rendering.md), and [acceptance](references/acceptance.md).
- Review only: load the references for the behavior under review; do not mutate external systems.

## Workflow

1. Read the target repo instructions and inspect only the relevant route, package, Convex, R2, renderer, discovery, and test files.
2. Confirm the requested scope and whether the target is a Next.js App Router, Convex, and R2 app. Preserve existing env names and focused helpers.
3. Implement the smallest complete receiver or repair. Keep distinct validation, download, storage, rendering, and database responsibilities in focused files. Add focused feature documentation, or update the existing feature's docs, with behavior, setup, relevant code/file tree, and verification.
4. Test the affected contract and failure paths with the fixtures in `assets/fixtures/`.
5. Run the target repo's focused lint, typecheck, test, and build commands in proportion to the change.
6. Hand off exact setup and deployment work that remains. Do not claim this repo-owned skill was deployed.

## Invariants

- The Next route owns webhook orchestration. Do not forward Blogr publication through Convex HTTP actions, `http.ts`, `.convex.site`, or another proxy.
- Authorize every externally callable publishing or ingestion Convex function at the Convex boundary. Next route bearer auth alone does not stop a direct Convex call.
- Finish durable publication before returning success. Blogr allows 15 seconds for the complete response, so bound article count, image count, bytes, and media concurrency. Do not acknowledge early unless the sender contract is deliberately changed to support durable asynchronous receipt.
- Preflight the whole batch before side effects. After R2 uploads, transactionally repeat ownership checks and write the accepted bounded batch's canonical records and summaries together.
- Stable Blogr source ID wins. Slug fallback is only for legacy records without a source ID; reject a slug collision with a different established source ID.
- Persist R2 object keys and stable same-origin serving routes, or explicitly configured permanent public URLs. Never persist an expiring presigned URL as the durable article value.
- Treat remote image URLs as SSRF input and `content_mdx`, `content_markdown`, `content_html`, and exported MDX as untrusted content.
- Never evaluate received imports, exports, JSX expressions, arbitrary components, or JavaScript. Exporting content to the repo does not make it trusted.
- Public discovery reads use lightweight summary records. Selecting fields after loading a full Convex document is still a full database read.
- Repo ingestion is explicit and user-run. It never commits, pushes, deploys, prunes, overwrites unmanaged files, or deletes retained database fallback automatically.
- Inspect the target deployment state. Distinguish code generation, development function pushes, and an explicitly authorized production deployment.
