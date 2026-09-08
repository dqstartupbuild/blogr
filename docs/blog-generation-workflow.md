# Blog Generation Workflow

## What It Does

The workflow turns a saved keyword into a longform MDX blog post. A user can also paste existing text into a topic's repurpose flow so the writer has a starting point.

It researches the topic, applies the active workspace settings, retrieves product context from the scanned website, chooses active internal links from the scanned product site, includes associate brand links when they are relevant, finds YouTube videos when enabled, collects sources, asks the configured Replicate writer model to write or repurpose the post, reviews the finished post for image-worthy sections, generates those images, and copies generated images into R2.

## How It Works

1. The workspace marks the topic as `writing` through the signed-in Convex client.
2. `POST /api/blogs/generate` checks the signed-in user.
3. The workspace sends the selected keyword, current product profile, current blog generation settings, and optional pasted source text to the route.
4. When the Cloud Run Job worker env vars are set, the route creates a durable Convex AI job and dispatches the Google Cloud AI worker. Otherwise it runs the same workflow locally.
5. The workflow removes internal gap-planning lead-ins from the primary keyword before research and writing.
6. Firecrawl Search collects source pages.
7. The workflow searches the active product workspace's RAG namespace for context that matches the keyword.
8. Active internal links are scored against the keyword, then limited by the workspace setting. Links marked "do not use" are ignored.
9. Associate brand links from workspace settings are passed to the writer as optional links that should only appear when they help the reader.
10. YouTube videos are found only when the workspace setting is on. The YouTube Data API is used when `YOUTUBE_API_KEY` exists. Otherwise the workflow searches YouTube video pages through Exa when `EXA_API_KEY` exists, then Firecrawl when `FIRECRAWL_API_KEY` exists.
11. Replicate writer generation uses the article style, writing rules, retrieved product context, selected internal links, associate brand links, optional repurposing source, toggles, and no image list before returning blog metadata and MDX in a simple XML shape.
12. Clean tags are built from the keyword, title, SEO title, excerpt, and topic brief.
13. The workflow divides the article's level-two sections into evenly spaced zones, assigns the requested supporting images across those zones, and asks the `REPLICATE_IMAGE_PLANNER_MODEL`, defaulting to `openai/gpt-5-mini`, to write prompts for those fixed locations.
14. Replicate image generation creates the number of images chosen in settings when `REPLICATE_API_TOKEN` exists. Multiple images are generated one after another so every requested image gets its own model run. Each image run explicitly polls until Replicate reports completion; failed runs or completed runs without a usable image URL are logged with generic diagnostics and skipped while the remaining images continue.
15. The generated image URLs are downloaded into R2. The worker or route uses the Convex R2 action when a Convex token is available, and otherwise writes directly to the same R2 bucket with the signed-in user's ID.
16. The MDX cleanup updates the feature image, inserts generated images near section headings, converts YouTube markdown links into playable iframe embeds, and adds found YouTube videos when the writer did not include them.
17. The workspace saves the blog, tags, and image R2 keys through `upsertGeneratedBlog`, which archives the existing article first when the topic has already been written, then marks the topic as written.

If research search is unavailable, the writer still uses the saved product
profile, active internal links, and associate brand links. If an image fails, the blog still finishes with the
images that did work. If the writer itself fails, the workspace marks the topic
as failed with a short error.

## Relevant Code

- `src/app/api/blogs/generate/route.ts`
- `src/app/api/worker/blog-ai/route.ts`
- `src/server/blogAiWorker/`
- `src/features/workspace/hooks/useLiveWorkspace.ts`
- `src/server/blog/generateBlogForKeyword.ts`
- `src/server/blog/normalizeBlogKeyword.ts`
- `src/server/blog/tags/buildBlogTags.ts`
- `src/server/blog/buildBlogGenerationSettingsPrompt.ts`
- `src/server/blog/buildAssociateBrandLinksPrompt.ts`
- `src/server/blog/buildRepurposedSourcePrompt.ts`
- `src/server/blog/buildProductRagContextPrompt.ts`
- `src/server/blog/runBlogResearch.ts`
- `src/server/blog/chooseInternalLinks.ts`
- `src/server/blog/findYoutubeVideos.ts`
- `src/server/blog/findYoutubeVideosWithApi.ts`
- `src/server/blog/findYoutubeVideosWithExa.ts`
- `src/server/blog/findYoutubeVideosWithFirecrawl.ts`
- `src/server/blog/insertMissingYoutubeVideos.ts`
- `src/server/blog/normalizeYoutubeLinksInMdx.ts`
- `src/server/blog/buildYoutubeEmbedMdx.ts`
- `src/server/blog/planBlogImagePrompts.ts`
- `src/server/blog/buildImagePlannerPrompt.ts`
- `src/server/blog/generateBlogImages.ts`
- `src/server/blog/storeGeneratedBlogImages.ts`
- `src/server/blog/applyBlogImagesToMdx.ts`
- `src/server/blog/tryGenerateBlogImage.ts`
- `src/server/blog/writeBlogDraft.ts`
- `src/server/blog/normalizeBlogMdxImages.ts`
- `src/server/blog/removeDuplicateMarkdownImages.ts`
- `src/server/blog/insertMissingSupportingImages.ts`
- `src/server/blog/parseWriterDraft.ts`
- `src/server/rag/searchProductRagContext.ts`
- `convex/blogs/upsertGeneratedBlog.ts`
- `convex/blogs/refreshBlogImageUrls.ts`
- `convex/rag/searchProductContext.ts`
- `convex/r2/storeImageFromUrl.ts`
- `convex/topics/updateTopicStatus.ts`

## Blog Output

The writer is asked for XML with:

- `<title>`
- `<seoTitle>`
- `<slug>`
- `<excerpt>`
- `<mdx>`

The MDX prompt asks for a visible article title, a separate SEO title between 70 and 110 characters, a meta description between 110 and 160 characters, frontmatter, one H1, a direct answer, short paragraphs, useful examples, cited sources, natural internal links, associate brand links only when useful, and playable YouTube embeds only when helpful. Workspace settings can add a table of contents, change article voice, allow first-person writing, add or remove a call-to-action, and allow similar product comparisons.

When optional source text is provided, the writer is told to use it as a starting point, keep the useful ideas, and rewrite the piece into a fresh blog post for the active product and keyword.

Images are planned after the article is written. The workflow selects distributed section locations first, then the image-planning reviewer writes prompts grounded in those assigned section bodies instead of using generic brand-related scenes. The reviewer cannot change the assigned heading or stable section index.

When YouTube videos are found but missing from the writer's MDX, the cleanup step appends a short helpful videos section with iframe embeds so the setting has a visible playable result.

Product scan assets and screenshots are removed from the product context sent to the writer so the image count setting controls article image use.

The retrieved product context is used for accuracy, reader fit, examples, and natural product references. It is not treated as a public research source unless the writer has a useful reason to cite the product page.

The parser still accepts JSON, fenced JSON, and raw MDX so a slightly different
model response does not break the whole job.

The image cleanup step enforces one use per image URL. It keeps the feature
image from being repeated and places missing supporting images by their assigned
section indexes. Heading matching and even distribution support older saved images that do not have an index. Blog queries refresh R2 image URLs and rewrite old
signed URLs in MDX before returning a saved post.

## Source References

- Firecrawl Search docs: https://docs.firecrawl.dev/api-reference/endpoint/search
- Exa Search API docs: https://exa.ai/docs/reference/search
- Replicate Node client docs: https://replicate.com/docs/get-started/nodejs
- Replicate Claude Sonnet 4.6: https://replicate.com/anthropic/claude-sonnet-4.6
- Replicate Nano Banana 2: https://replicate.com/google/nano-banana-2/readme
- Convex Next.js server route docs: https://docs.convex.dev/client/nextjs/app-router/server-rendering

## File Tree

```text
src/app/api/blogs/generate/
src/server/blog/
src/server/r2/
src/server/rag/
src/server/firecrawl/
src/server/exa/
src/server/replicate/
src/server/blogAiWorker/
convex/rag/
convex/r2/
convex/blogs/
convex/topics/
```
