# Blog Tags

## What It Does

Generated blogs now carry several clean tags instead of publishing one raw keyword tag.

The tag builder removes internal planning phrases like `Cover this gap` and derives useful labels from the blog keyword, title, SEO title, excerpt, and saved topic brief. Published payloads reuse saved tags and rebuild clean fallback tags for older blogs that do not have tags yet.

## How It Works

`generateBlogForKeyword` first normalizes the primary keyword so a saved gap plan like `Cover this gap: pricing page examples` becomes `pricing page examples` before research, writing, and saving.

`writeBlogDraft` calls `buildBlogTags` after the title, SEO title, excerpt, and MDX are ready. The generated tag list is saved through `upsertGeneratedBlog` on the blog record.

`buildBlogPublishTags` uses the blog's stored tags first. It then adds fallback tags from current blog fields, normalizes duplicates, removes sloppy labels, and caps the final publish list at six tags.

Older blog records can omit `tags`. The mapper returns an empty tag list for those records, and publishing still sends clean fallback tags.

## Relevant Code

- `src/server/blog/normalizeBlogKeyword.ts`
- `src/server/blog/tags/buildBlogTags.ts`
- `src/server/blog/tags/normalizeBlogTag.ts`
- `src/server/blog/tags/removeBlogTagLeadIn.ts`
- `src/server/blog/writeBlogDraft.ts`
- `src/server/blog/generateBlogForKeyword.ts`
- `src/server/publishing/buildBlogPublishTags.ts`
- `convex/blogs/upsertGeneratedBlog.ts`
- `convex/schema.ts`
- `src/features/workspace/mappers/mapConvexBlog.ts`
- `src/app/api/blogs/download/blogItemSchema.ts`

## Use Cases

- Publish cleaner article tags to a connected blog app.
- Avoid internal planning labels becoming public-facing tags.
- Give each article several helpful tags based on the topic and article metadata.
- Keep old saved blogs publishable even if they were created before tags were stored.

## File Tree

```text
src/server/blog/tags/
src/server/blog/normalizeBlogKeyword.ts
src/server/blog/writeBlogDraft.ts
src/server/blog/generateBlogForKeyword.ts
src/server/publishing/buildBlogPublishTags.ts
convex/blogs/upsertGeneratedBlog.ts
src/features/workspace/types/BlogItem.ts
```
