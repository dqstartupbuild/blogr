# Blog Generation Reliability

## What It Does

The blog writer is built to keep a topic from failing just because one outside service returns a messy response.

If research search is unavailable, the app still writes from the saved product profile and internal links. If one image fails, the rest of the blog can still finish. If the writer returns XML, JSON, fenced JSON, or plain MDX, the app reads the useful parts instead of crashing.

## How It Works

1. `runBlogResearch` tries Firecrawl Search and returns an empty source list if search is unavailable.
2. `writeBlogDraft` writes the article before images are generated.
3. `planBlogImagePrompts` assigns evenly distributed article sections before asking the image-planning reviewer to write prompts for them. If that model fails or omits a plan, it uses a fallback prompt for the same assigned section.
4. `generateBlogImages` asks for each image separately and keeps any image that returns a usable URL. `runReplicateImage` explicitly polls Replicate until each prediction is complete, including predictions that first report `processing`.
5. `getBlogFeatureImage` uses section assignments to avoid promoting a supporting image when feature-image generation fails, while preserving first-image behavior for older saved articles.
6. `normalizeReplicateImageUrl` reads normal URLs and Replicate file outputs. A completed prediction without a usable URL is treated as an image failure, so it cannot be saved as an empty image.
7. `buildBlogWriterPrompt` asks Claude Sonnet 4.6 for simple XML so long MDX does not need escaped JSON newlines.
8. `parseWriterDraft` tries XML first, JSON second, and raw MDX last.
9. `normalizeBlogMdxImages` removes repeated markdown image URLs and inserts unused supporting images at their stable level-two section indexes.

## Use Cases

- Replicate creates an image but the writer response is wrapped in a code fence.
- The writer returns valid MDX but not valid JSON.
- Firecrawl Search is down or missing during a local preview.
- One image prompt fails while the other images succeed.
- A Replicate prediction initially reports `processing` with no output, then completes with a file output URL.
- A completed Replicate prediction has no output and is isolated as one image failure.
- The writer repeats the feature image in several sections.
- The writer forgets to place one of the supporting images.
- The image-planning reviewer fails and the app keeps the same distributed placements with fallback prompts.
- Two article sections use the same heading text but retain separate image positions.

## Relevant Code

- `src/server/blog/runBlogResearch.ts`
- `src/server/blog/planBlogImagePrompts.ts`
- `src/server/blog/generateBlogImages.ts`
- `src/server/blog/getBlogFeatureImage.ts`
- `src/server/blog/tryGenerateBlogImage.ts`
- `src/server/replicate/normalizeReplicateImageUrl.ts`
- `src/server/replicate/getReplicateFileOutputUrl.ts`
- `src/server/replicate/runReplicateImage.test.ts`
- `src/server/blog/tryGenerateBlogImage.test.ts`
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
