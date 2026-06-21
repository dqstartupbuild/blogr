# Article Image Planning Agent

## What It Does

The article is written before images are generated. After the writer returns MDX, a second Replicate model reviews the finished article, chooses the sections where images would help most, and writes image prompts for those exact sections.

This keeps supporting images tied to the article instead of making generic brand-related visuals.

This is implemented as a stateless review agent inside the blog generation route, not as a Convex Agent thread. The route needs one deterministic post-write review pass, and keeping it local avoids adding another Convex-authenticated step to a long-running generation flow.

## How It Works

1. `writeBlogDraft` writes the full article with no image list.
2. `planBlogImagePrompts` counts the requested images from workspace settings.
3. `buildImagePlannerPrompt` sends the finished MDX, product visual context, image style, and requested image count to the image-planning reviewer.
4. `runReplicateImagePlannerText` calls Replicate with `REPLICATE_IMAGE_PLANNER_MODEL`, defaulting to `openai/gpt-5-mini`.
5. `parseBlogImagePromptPlans` reads the reviewer JSON.
6. If the reviewer fails or returns no usable prompts, `buildFallbackBlogImagePromptPlans` creates prompts from the article title and section headings.
7. `generateBlogImages` runs one image model job per prompt.
8. `applyBlogImagesToMdx` updates frontmatter, inserts the feature image, and places supporting images near headings.

## Relevant Code

- `src/server/blog/generateBlogForKeyword.ts`
- `src/server/blog/writeBlogDraft.ts`
- `src/server/blog/planBlogImagePrompts.ts`
- `src/server/blog/buildImagePlannerPrompt.ts`
- `src/server/replicate/runReplicateImagePlannerText.ts`
- `src/server/blog/buildFallbackBlogImagePromptPlans.ts`
- `src/server/blog/applyBlogImagesToMdx.ts`
- `src/server/blog/generateBlogImages.ts`
- `src/server/blog/storeGeneratedBlogImages.ts`

## Setup

Set the reviewer model when you want to override the default:

```bash
REPLICATE_IMAGE_PLANNER_MODEL=openai/gpt-5-mini
```

The reviewer uses the same `REPLICATE_API_TOKEN` as the writer and image generator.

## Source References

- Replicate Node client docs: https://replicate.com/docs/get-started/nodejs
- Exa Search API docs: https://exa.ai/docs/reference/search

## File Tree

```text
src/server/blog/*ImagePlanner*
src/server/blog/planBlogImagePrompts.ts
src/server/blog/applyBlogImagesToMdx.ts
src/server/replicate/runReplicateImagePlannerText.ts
```
