# Blog Generation Workflow

## What It Does

The workflow turns a saved keyword into a longform MDX blog post.

It researches the topic, chooses internal links from the scanned product site, finds YouTube videos, collects sources, generates images, and asks the configured Replicate writer model to write the post.

## How It Works

1. The workspace marks the topic as `writing` through the signed-in Convex client.
2. `POST /api/blogs/generate` checks the signed-in user.
3. The workspace sends the selected keyword and current product profile to the route.
4. Firecrawl Search collects source pages.
5. Internal links are scored against the keyword.
6. YouTube videos are found through the YouTube API when `YOUTUBE_API_KEY` exists, otherwise a YouTube search link is used.
7. Replicate image generation creates one feature image and several supporting images when `REPLICATE_API_TOKEN` exists.
8. Replicate writer generation returns blog metadata and MDX in a simple XML shape.
9. The MDX image cleanup removes repeated image URLs and inserts any unused supporting images near section headings.
10. The workspace saves the blog through `upsertGeneratedBlog`, which marks the topic as written.

If research search is unavailable, the writer still uses the saved product
profile and internal links. If an image fails, the blog still finishes with the
images that did work. If the writer itself fails, the workspace marks the topic
as failed with a short error.

## Relevant Code

- `src/app/api/blogs/generate/route.ts`
- `src/features/workspace/hooks/useLiveWorkspace.ts`
- `src/server/blog/generateBlogForKeyword.ts`
- `src/server/blog/runBlogResearch.ts`
- `src/server/blog/chooseInternalLinks.ts`
- `src/server/blog/findYoutubeVideos.ts`
- `src/server/blog/generateBlogImages.ts`
- `src/server/blog/tryGenerateBlogImage.ts`
- `src/server/blog/writeBlogDraft.ts`
- `src/server/blog/normalizeBlogMdxImages.ts`
- `src/server/blog/removeDuplicateMarkdownImages.ts`
- `src/server/blog/insertMissingSupportingImages.ts`
- `src/server/blog/parseWriterDraft.ts`
- `convex/blogs/upsertGeneratedBlog.ts`
- `convex/topics/updateTopicStatus.ts`

## Blog Output

The writer is asked for XML with:

- `<title>`
- `<slug>`
- `<excerpt>`
- `<mdx>`

The MDX prompt asks for frontmatter, one H1, a direct answer, short paragraphs, useful examples, cited sources, natural internal links, YouTube links only when helpful, and images placed throughout.

The parser still accepts JSON, fenced JSON, and raw MDX so a slightly different
model response does not break the whole job.

The image cleanup step enforces one use per image URL. It keeps the feature
image from being repeated and places missing supporting images by the next
available section heading.

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
src/server/firecrawl/
src/server/replicate/
convex/blogs/
convex/topics/
```
