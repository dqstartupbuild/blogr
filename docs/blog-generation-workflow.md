# Blog Generation Workflow

## What It Does

The workflow turns a saved keyword into a longform MDX blog post.

It researches the topic, applies the active workspace settings, retrieves product context from the scanned website, chooses internal links from the scanned product site, finds YouTube videos when enabled, collects sources, generates images, copies generated images into R2, and asks the configured Replicate writer model to write the post.

## How It Works

1. The workspace marks the topic as `writing` through the signed-in Convex client.
2. `POST /api/blogs/generate` checks the signed-in user.
3. The workspace sends the selected keyword, current product profile, and current blog generation settings to the route.
4. Firecrawl Search collects source pages.
5. The workflow searches the active product workspace's RAG namespace for context that matches the keyword.
6. Internal links are scored against the keyword, then limited by the workspace setting.
7. YouTube videos are found only when the workspace setting is on. The YouTube Data API is used when `YOUTUBE_API_KEY` exists. Otherwise the workflow searches YouTube video pages through Firecrawl when `FIRECRAWL_API_KEY` exists.
8. Replicate image generation creates the number of images chosen in settings when `REPLICATE_API_TOKEN` exists. Multiple images are generated one after another so every requested image gets its own model run.
9. The generated image URLs are downloaded into R2 through the Convex R2 component with a fresh optional Convex auth token at storage time.
10. Replicate writer generation uses the article style, writing rules, retrieved product context, toggles, and R2 image URLs before returning blog metadata and MDX in a simple XML shape.
11. The MDX cleanup removes repeated image URLs, inserts any unused supporting images near section headings, and adds found YouTube videos when the writer did not include them.
12. The workspace saves the blog and image R2 keys through `upsertGeneratedBlog`, which marks the topic as written.

If research search is unavailable, the writer still uses the saved product
profile and internal links. If an image fails, the blog still finishes with the
images that did work. If the writer itself fails, the workspace marks the topic
as failed with a short error.

## Relevant Code

- `src/app/api/blogs/generate/route.ts`
- `src/features/workspace/hooks/useLiveWorkspace.ts`
- `src/server/blog/generateBlogForKeyword.ts`
- `src/server/blog/buildBlogGenerationSettingsPrompt.ts`
- `src/server/blog/buildProductRagContextPrompt.ts`
- `src/server/blog/runBlogResearch.ts`
- `src/server/blog/chooseInternalLinks.ts`
- `src/server/blog/findYoutubeVideos.ts`
- `src/server/blog/findYoutubeVideosWithApi.ts`
- `src/server/blog/findYoutubeVideosWithFirecrawl.ts`
- `src/server/blog/insertMissingYoutubeVideos.ts`
- `src/server/blog/generateBlogImages.ts`
- `src/server/blog/storeGeneratedBlogImages.ts`
- `src/server/blog/buildImagePromptPlans.ts`
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
- `<slug>`
- `<excerpt>`
- `<mdx>`

The MDX prompt asks for frontmatter, one H1, a direct answer, short paragraphs, useful examples, cited sources, natural internal links, YouTube links only when helpful, and images placed throughout. Workspace settings can add a table of contents, change article voice, allow first-person writing, add or remove a call-to-action, and allow similar product comparisons.

When YouTube videos are found but missing from the writer's MDX, the cleanup step appends a short helpful videos section so the setting has a visible result.

The writer receives only the generated article image list as usable article images. Product scan assets and screenshots are removed from the product context sent to the writer so the image count setting controls article image use.

The retrieved product context is used for accuracy, reader fit, examples, and natural product references. It is not treated as a public research source unless the writer has a useful reason to cite the product page.

The parser still accepts JSON, fenced JSON, and raw MDX so a slightly different
model response does not break the whole job.

The image cleanup step enforces one use per image URL. It keeps the feature
image from being repeated and places missing supporting images by the next
available section heading. Blog queries refresh R2 image URLs and rewrite old
signed URLs in MDX before returning a saved post.

## Source References

- Firecrawl Search docs: https://docs.firecrawl.dev/api-reference/endpoint/search
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
src/server/replicate/
convex/rag/
convex/r2/
convex/blogs/
convex/topics/
```
