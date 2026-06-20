# Blog Generation Reliability

## What It Does

The blog writer is built to keep a topic from failing just because one outside service returns a messy response.

If research search is unavailable, the app still writes from the saved product profile and internal links. If one image fails, the rest of the blog can still finish. If the writer returns XML, JSON, fenced JSON, or plain MDX, the app reads the useful parts instead of crashing.

## How It Works

1. `runBlogResearch` tries Firecrawl Search and returns an empty source list if search is unavailable.
2. `generateBlogImages` asks for each image separately and keeps any image that returns a usable URL.
3. `normalizeReplicateImageUrl` reads normal URLs and Replicate file outputs.
4. `buildBlogWriterPrompt` asks Claude Sonnet 4.6 for simple XML so long MDX does not need escaped JSON newlines.
5. `parseWriterDraft` tries XML first, JSON second, and raw MDX last.
6. `normalizeBlogMdxImages` removes repeated markdown image URLs and inserts unused supporting images near section headings.

## Use Cases

- Replicate creates an image but the writer response is wrapped in a code fence.
- The writer returns valid MDX but not valid JSON.
- Firecrawl Search is down or missing during a local preview.
- One image prompt fails while the other images succeed.
- The writer repeats the feature image in several sections.
- The writer forgets to place one of the supporting images.

## Relevant Code

- `src/server/blog/runBlogResearch.ts`
- `src/server/blog/generateBlogImages.ts`
- `src/server/blog/tryGenerateBlogImage.ts`
- `src/server/replicate/normalizeReplicateImageUrl.ts`
- `src/server/replicate/getReplicateFileOutputUrl.ts`
- `src/server/blog/buildBlogWriterPrompt.ts`
- `src/server/blog/normalizeBlogMdxImages.ts`
- `src/server/blog/removeDuplicateMarkdownImages.ts`
- `src/server/blog/insertMissingSupportingImages.ts`
- `src/server/blog/parseWriterDraft.ts`
- `src/server/blog/parseWriterXmlDraft.ts`
- `src/server/blog/parseWriterJsonDraft.ts`
- `src/server/blog/createRawMdxWriterDraft.ts`

## Source References

- Replicate Claude Sonnet 4.6: https://replicate.com/anthropic/claude-sonnet-4.6
- Replicate Nano Banana 2: https://replicate.com/google/nano-banana-2/readme

## File Tree

```text
src/server/blog/
src/server/replicate/
docs/blog-generation-reliability.md
```
