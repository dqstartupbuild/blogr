# Article Image Planning Agent

## What It Does

The article is written before images are generated. After the writer returns MDX, the app divides its level-two sections into evenly spaced zones and assigns supporting images across the full article. A second Replicate model then writes image prompts for those exact assigned sections.

This keeps supporting images tied to the article instead of making generic brand-related visuals, while preventing every image from collecting near the opening sections.

This is implemented as a stateless review agent inside the blog generation route, not as a Convex Agent thread. The route needs one deterministic post-write review pass, and keeping it local avoids adding another Convex-authenticated step to a long-running generation flow.

## How It Works

1. `writeBlogDraft` writes the full article with no image list.
2. `planBlogImagePrompts` counts the requested images from workspace settings.
3. `extractMdxSections` reads every level-two section and gives it a stable article index.
4. `selectDistributedMdxSections` divides the article into equal zones and selects the midpoint section from each zone. The feature image remains assigned to the article as a whole.
5. `buildImagePlannerPrompt` sends the complete heading assignments, the selected section bodies, product visual context, and image style to the image-planning reviewer. It does not truncate the article to its opening characters.
6. `runReplicateImagePlannerText` calls Replicate with `REPLICATE_IMAGE_PLANNER_MODEL`, defaulting to `openai/gpt-5-mini`.
7. `parseBlogImagePromptPlans` reads the reviewer JSON.
8. `mergeBlogImagePromptPlans` uses the reviewer's visual details but always restores the code-selected heading and section index. The reviewer cannot move an image into a different section.
9. If the reviewer fails or omits a usable prompt, `buildFallbackBlogImagePromptPlans` supplies a section-specific fallback for that same assigned location.
10. `generateBlogImages` runs one image model job per prompt.
11. `applyBlogImagesToMdx` updates frontmatter, inserts the feature image, and places supporting images by stable section index. Heading matching and even distribution remain compatibility fallbacks for older image records.

## Relevant Code

- `src/server/blog/generateBlogForKeyword.ts`
- `src/server/blog/writeBlogDraft.ts`
- `src/server/blog/planBlogImagePrompts.ts`
- `src/server/blog/buildImagePlannerPrompt.ts`
- `src/server/blog/buildImagePlannerAssignedContext.ts`
- `src/server/blog/extractMdxSections.ts`
- `src/server/blog/selectDistributedMdxSections.ts`
- `src/server/blog/mergeBlogImagePromptPlans.ts`
- `src/server/replicate/runReplicateImagePlannerText.ts`
- `src/server/blog/buildFallbackBlogImagePromptPlans.ts`
- `src/server/blog/applyBlogImagesToMdx.ts`
- `src/server/blog/generateBlogImages.ts`
- `src/server/blog/storeGeneratedBlogImages.ts`

## Placement Examples

For an article with nine level-two sections and three supporting images, the selected section indexes are 1, 4, and 7. The images therefore land in the early, middle, and late portions of the article without being forced into unrelated sections.

For an article with fewer sections than requested supporting images, each available section is selected at most once. The workflow creates fewer supporting images rather than stacking duplicates under the same heading.

Repeated heading text is safe because placement uses the section's numeric position. The heading remains attached for readability and older saved articles.

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
src/server/blog/extractMdxSections.ts
src/server/blog/selectDistributedMdxSections.ts
src/server/blog/mergeBlogImagePromptPlans.ts
src/server/blog/applyBlogImagesToMdx.ts
src/server/replicate/runReplicateImagePlannerText.ts
```
