# Blog Generation Settings

## What It Does

Each product workspace has its own blog generation settings. The Settings tab lets a user choose article style, writing rules, internal link count, associate brand links, image style, image count, and article extras before generating posts.

The settings stay attached to the active product workspace, so one product can use a formal tone while another uses a friendlier voice.

## How It Works

The `/settings` route opens the shared workspace page with `initialMode="settings"`. `WorkspaceTabs` shows Settings next to Topics and Blogs, and `WorkspaceContent` renders product setup, publishing setup, and `WorkspaceSettingsPanel` for that mode.

Live mode reads `products.blogGenerationSettings` from Convex, fills missing values with `defaultBlogGenerationSettings`, and saves changes through `updateBlogGenerationSettings`. Demo mode keeps the same settings shape in local state per workspace.

When a user writes a blog, the active product profile and current `blogGenerationSettings` are sent to `POST /api/blogs/generate`. The route receives settings as their own request field so the newest saved settings are used even if the product query has not refreshed yet.

The blog generation workflow applies settings before research, link choice, associate brand link prompting, video lookup, image generation, and writer prompting.

## Settings

- Article style controls the main voice used in the writer prompt.
- Global article settings add the user's own writing rules without changing the required XML response shape.
- Internal links controls how many sitemap links can be selected for each article.
- Associate brand links stores up to 5 partner, affiliate, marketplace, or related brand links. Each link has a name, URL, and explanation so the writer can include it only when it helps the reader.
- Image style changes the image prompt direction used by the image-planning reviewer.
- Images per article controls how many image prompts are created after the article is written. Each requested image runs as its own Replicate image job. If no images are requested, the writer is told not to add image markdown or pull product scan images into the article.
- Table of contents asks the writer to add a short section list.
- YouTube video controls whether the workflow looks for videos. With `YOUTUBE_API_KEY`, the app uses the YouTube Data API. Without it, the app searches YouTube video pages through Exa when `EXA_API_KEY` is available, then Firecrawl when `FIRECRAWL_API_KEY` is available. Found videos are rendered as playable embeds and are added to the article when the writer does not include them. AI alone is not used to invent video URLs.
- Call-to-action controls whether the writer ends with a product next step.
- Include infographics guides supporting images toward data-style visuals when useful.
- Mention similar products and tools allows natural comparison sections.
- First-person writing allows "I" and "my" when that voice fits.

## Relevant Code

- `src/app/settings/page.tsx`
- `src/features/workspace/components/WorkspaceTabs.tsx`
- `src/features/workspace/components/WorkspaceContent.tsx`
- `src/features/workspace/components/WorkspaceSettingsPanel.tsx`
- `src/features/workspace/components/AssociateBrandLinksSection.tsx`
- `src/features/workspace/components/AssociateBrandLinkFields.tsx`
- `src/features/workspace/components/SettingsFormSection.tsx`
- `src/features/workspace/components/SettingsSelectField.tsx`
- `src/features/workspace/components/SettingsTextareaField.tsx`
- `src/features/workspace/components/SettingsToggleField.tsx`
- `src/features/workspace/constants/defaultBlogGenerationSettings.ts`
- `src/features/workspace/types/AssociateBrandLink.ts`
- `src/features/workspace/types/BlogGenerationSettings.ts`
- `src/features/workspace/utils/normalizeAssociateBrandLinks.ts`
- `src/features/workspace/utils/normalizeBlogGenerationSettings.ts`
- `src/features/workspace/hooks/useLiveWorkspace.ts`
- `src/features/workspace/hooks/useDemoWorkspace.ts`
- `convex/products/updateBlogGenerationSettings.ts`
- `convex/products/blogGenerationSettingsValidator.ts`
- `src/app/api/blogs/generate/blogGenerationSettingsSchema.ts`
- `src/app/api/blogs/generate/associateBrandLinkSchema.ts`
- `src/server/blog/generateBlogForKeyword.ts`
- `src/server/blog/buildAssociateBrandLinksPrompt.ts`
- `src/server/blog/buildBlogGenerationSettingsPrompt.ts`
- `src/server/blog/buildBlogWriterProductContext.ts`
- `src/server/blog/planBlogImagePrompts.ts`
- `src/server/blog/buildImagePlannerPrompt.ts`
- `src/server/blog/findYoutubeVideosWithApi.ts`
- `src/server/blog/findYoutubeVideosWithExa.ts`
- `src/server/blog/findYoutubeVideosWithFirecrawl.ts`

## Use Cases

- Keep different tones for different products or clients.
- Limit internal links when an article should stay lighter.
- Add associate brand links that can be mentioned when they fit the topic.
- Turn off videos for topics where embedded media is not useful.
- Generate fewer images when speed matters.
- Use branded feature images for product-led articles.
- Use current settings immediately after saving them.

## Source References

- Next.js App Router overview: `node_modules/next/dist/docs/01-app/index.md`
- Convex schema: `convex/schema.ts`
- Blog generation workflow: `docs/blog-generation-workflow.md`

## File Tree

```text
src/app/settings/
src/features/workspace/components/WorkspaceSettingsPanel.tsx
src/features/workspace/components/AssociateBrand*
src/features/workspace/components/Settings*
src/features/workspace/constants/*Settings*
src/features/workspace/types/*Settings*
src/features/workspace/utils/normalizeBlogGenerationSettings.ts
convex/products/*BlogGenerationSettings*
src/app/api/blogs/generate/*Settings*
src/server/blog/*Settings*
```
