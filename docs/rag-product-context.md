# RAG Product Context

## What It Does

Product website scans are indexed with the Convex RAG component. When a blog is generated, the workflow retrieves the most relevant scanned product context for that keyword and gives it to the writer.

This helps the article mention the product, audience, examples, and site details more accurately without forcing every scan detail into every prompt.

Only active scanned links are included when link lists are rebuilt for RAG text and writer context. Links marked "do not use" stay saved on the workspace but are not selected as internal links.

## How It Works

1. The workspace creates or updates the product workspace before the slow website scan starts.
2. `POST /api/product/scan` receives the active product ID, scans the website, and copies scanned images into R2.
3. `indexProductRagContext` calls the Convex `indexProductContext` action with the product profile, internal links, and raw scanned context.
4. The Convex action verifies the product belongs to the signed-in user.
5. The RAG component stores the context under a namespace built from the product ID.
6. Rescanning uses the same key, so the latest scan replaces the old product context.
7. Blog generation sends the active product ID to `POST /api/blogs/generate`.
8. `searchProductRagContext` calls the Convex `searchProductContext` action with the keyword.
9. The writer prompt receives the returned context along with settings, research, links, videos, and generated images.

If Convex RAG search or indexing is unavailable, the app continues with the saved product profile and normal blog generation flow.

## Setup

The RAG component is installed in `convex/convex.config.ts` and uses OpenAI embeddings through `@ai-sdk/openai`.

Set the embedding key on the Convex deployment:

```bash
npx convex env set OPENAI_API_KEY <openai-api-key>
```

Then regenerate Convex bindings after install or component changes:

```bash
npx convex codegen
```

## Data Boundaries

Each product workspace gets its own RAG namespace. The Convex actions check ownership before indexing or searching, and the Next.js server calls those actions with the signed-in user's Convex auth token.

The indexed text includes:

- Product name, website, niche, audience, description, and competitors.
- Internal site links found during the scan.
- Raw scanned website context.

Generated article images are not indexed. Scanned image files are stored through R2, while RAG stores text for retrieval.

## Relevant Code

- `convex/convex.config.ts`
- `convex/rag/client.ts`
- `convex/rag/buildProductRagNamespace.ts`
- `convex/rag/productRagKey.ts`
- `convex/rag/buildProductRagText.ts`
- `convex/rag/indexProductContext.ts`
- `convex/rag/searchProductContext.ts`
- `convex/products/getProductForRag.ts`
- `src/server/rag/indexProductRagContext.ts`
- `src/server/rag/searchProductRagContext.ts`
- `src/server/blog/buildProductRagContextPrompt.ts`
- `src/server/blog/generateBlogForKeyword.ts`
- `src/app/api/product/scan/route.ts`
- `src/app/api/blogs/generate/route.ts`
- `src/features/workspace/hooks/useLiveWorkspace.ts`

## Source References

- Convex RAG component package: `@convex-dev/rag`
- Convex RAG component docs: `/Users/starship/.codex/attachments/84a0cc44-be90-4953-b8d8-ecbbf6cf5b81/pasted-text.txt`
- AI SDK OpenAI provider package: `@ai-sdk/openai`
- Convex schema: `convex/schema.ts`

## File Tree

```text
convex/rag/
convex/products/getProductForRag.ts
src/server/rag/
src/server/blog/buildProductRagContextPrompt.ts
src/server/blog/generateBlogForKeyword.ts
src/app/api/product/scan/
src/app/api/blogs/generate/
```
