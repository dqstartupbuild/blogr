# Article Image Actions

## Overview

Article images can be managed directly from the article preview. Each image has one kebab menu, keeping all image actions together without covering the image with several buttons.

## Available Actions

- **Regenerate** opens the existing image prompt dialog.
- **Edit alt text** updates the saved image details and its markdown alt text.
- **Move in article** opens the article sections and lets the user drag the image to a complete section boundary.
- **Make feature image** swaps a body image with the current feature image. The old feature image moves to the selected body image's section.
- **Remove image** removes the image from the article. Removing the feature image promotes the next image when one is available.

The feature image does not show Move or Make feature image because it already has a fixed article-level position.

## Image Placement

The image planner's `sectionHeading` now stays attached to the image through generation, R2 storage, Convex, downloads, and regeneration. Supporting images are inserted under the matching level-two heading. If generated metadata cannot be matched to a saved heading, the fallback distributes images from the beginning through the end of the article.

Manual repositioning uses the same heading-aware insertion path. The app removes only the managed image markdown, leaves article content unchanged, and inserts the image immediately under the selected heading. It never inserts into a paragraph, list, table, or table of contents.

## Article Editing

Managed image markdown and the feature-image frontmatter line are hidden from the article-body textarea. The saved MDX still contains them. When article text changes, the editor restores managed images at their section boundaries, while image URLs and alt text remain controlled by the preview actions.

## Data and Reads

`updateBlogImages` receives the already loaded image list and MDX from the client. The Convex mutation performs one ownership read for the blog, patches the article, and updates the existing read models. Image actions do not load the product or issue a separate blog query before saving.

## Relevant Code

- `convex/blogs/updateBlogImages.ts`
- `src/server/blog/planBlogImagePrompts.ts`
- `src/server/blog/insertMissingSupportingImages.ts`
- `src/features/workspace/components/ImageActionsMenu.tsx`
- `src/features/workspace/components/ImageAltTextDialog.tsx`
- `src/features/workspace/components/ImageRepositionDialog.tsx`
- `src/features/workspace/components/RegenerateableImage.tsx`
- `src/features/workspace/components/BlogMdxTextarea.tsx`
- `src/features/workspace/hooks/useBlogImageActions.ts`
- `src/features/workspace/utils/rebuildManagedBlogImagesInMdx.ts`
- `src/features/workspace/utils/buildBlogFeatureImageSwapChanges.ts`
- `src/features/workspace/utils/buildBlogImageAltChanges.ts`
- `src/features/workspace/utils/buildBlogImageMoveChanges.ts`
- `src/features/workspace/utils/buildBlogImageRemovalChanges.ts`

## Use Cases

- Keep generated visuals next to the sections they explain.
- Remove an image that does not add value.
- Improve accessibility without touching markdown.
- Reorder a visual without breaking article content.
- Promote a strong supporting visual to the feature position.

## File Tree

```text
convex/blogs/
  updateBlogImages.ts
src/server/blog/
  insertMissingSupportingImages.ts
  planBlogImagePrompts.ts
src/features/workspace/
├── components/
│   ├── BlogMdxTextarea.tsx
│   ├── ImageActionsMenu.tsx
│   ├── ImageAltTextDialog.tsx
│   ├── ImageRepositionDialog.tsx
│   └── RegenerateableImage.tsx
├── hooks/
│   └── useBlogImageActions.ts
├── types/
│   ├── BlogImageChanges.ts
│   └── UpdateBlogImages.ts
└── utils/
    ├── buildBlogFeatureImageSwapChanges.ts
    ├── buildBlogImageAltChanges.ts
    ├── buildBlogImageMoveChanges.ts
    ├── buildBlogImageRemovalChanges.ts
    └── rebuildManagedBlogImagesInMdx.ts
```
