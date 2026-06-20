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
7. Replicate image generation creates a feature image and supporting images when `REPLICATE_API_TOKEN` exists.
8. Replicate writer generation returns blog metadata and MDX.
9. The workspace saves the blog through `upsertGeneratedBlog`, which marks the topic as written.

If anything fails after writing starts, the workspace marks the topic as failed
with a short error.

## Relevant Code

- `src/app/api/blogs/generate/route.ts`
- `src/features/workspace/hooks/useLiveWorkspace.ts`
- `src/server/blog/generateBlogForKeyword.ts`
- `src/server/blog/runBlogResearch.ts`
- `src/server/blog/chooseInternalLinks.ts`
- `src/server/blog/findYoutubeVideos.ts`
- `src/server/blog/generateBlogImages.ts`
- `src/server/blog/writeBlogDraft.ts`
- `convex/blogs/upsertGeneratedBlog.ts`
- `convex/topics/updateTopicStatus.ts`

## Blog Output

The writer is asked for JSON with:

- `title`
- `slug`
- `excerpt`
- `mdx`

The MDX prompt asks for frontmatter, one H1, a direct answer, short paragraphs, useful examples, cited sources, natural internal links, YouTube links only when helpful, and images placed throughout.

## Source References

- Firecrawl Search docs: https://docs.firecrawl.dev/api-reference/endpoint/search
- Replicate Node client docs: https://replicate.com/docs/get-started/nodejs
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
