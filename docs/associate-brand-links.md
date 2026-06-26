# Associate Brand Links

## What It Does

Each product workspace can save up to 5 associate brand links. These are partner, affiliate, marketplace, or related brand pages the writer may include when they genuinely help the reader.

Each link stores a name, URL, and plain explanation of what it does. Blank rows are ignored, and rows without a URL are not saved.

## How It Works

`WorkspaceSettingsPanel` renders `AssociateBrandLinksSection` inside Article settings. The section lets users add, edit, and remove up to 5 links.

When settings are saved, `normalizeAssociateBrandLinks` trims each row, removes rows without URLs, and limits the list to 5. Live workspaces persist the list through `updateBlogGenerationSettings`; demo workspaces keep it in local state.

During blog generation, `generateBlogForKeyword` reads the normalized settings and passes the associate brand links to `writeBlogDraft`. `buildBlogWriterPrompt` gives the writer the links and explains that they should be used only when they naturally help the reader. The prompt also tells the writer to link only to provided internal links, associate brand links, research sources, and YouTube videos.

## Relevant Code

- `src/features/workspace/components/AssociateBrandLinksSection.tsx`
- `src/features/workspace/components/AssociateBrandLinkFields.tsx`
- `src/features/workspace/types/AssociateBrandLink.ts`
- `src/features/workspace/types/BlogGenerationSettings.ts`
- `src/features/workspace/utils/normalizeAssociateBrandLinks.ts`
- `src/app/api/blogs/generate/associateBrandLinkSchema.ts`
- `src/server/blog/buildAssociateBrandLinksPrompt.ts`
- `src/server/blog/buildBlogWriterPrompt.ts`
- `src/server/blog/generateBlogForKeyword.ts`
- `convex/products/blogGenerationSettingsValidator.ts`

## Use Cases

- Mention an affiliate page when it fits the article topic.
- Include a partner brand link near a relevant recommendation.
- Save marketplace, demo, or integration links that should not be treated as internal site links.
- Give the writer enough context to avoid forcing links where they do not belong.

## File Tree

```text
src/features/workspace/components/AssociateBrand*
src/features/workspace/types/AssociateBrandLink.ts
src/features/workspace/utils/normalizeAssociateBrandLinks.ts
src/app/api/blogs/generate/associateBrandLinkSchema.ts
src/server/blog/buildAssociateBrandLinksPrompt.ts
convex/products/blogGenerationSettingsValidator.ts
```
