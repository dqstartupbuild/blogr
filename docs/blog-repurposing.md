# Blog Repurposing

## What It Does

Blog repurposing lets a user start from existing text instead of a blank topic.

From a saved topic, the user can click **Repurpose**, paste a blog post, case study, notes, transcript, or draft, and ask the writer to turn it into a fresh product-focused blog post.

## How It Works

1. Each topic row shows a **Repurpose** button beside **Write blog**.
2. `TopicRepurposeDialog` collects the pasted source text.
3. The workspace calls the same `writeBlog` action used by normal blog writing, with `sourceText` in the options.
4. The live workspace sends `sourceText` to `POST /api/blogs/generate`.
5. The route validates the pasted text and passes it into `generateBlogForKeyword`.
6. `writeBlogDraft` includes the source text in the writer prompt through `buildRepurposedSourcePrompt`.
7. The writer treats the source as a starting point, then rewrites it for the active product, keyword, research, internal links, media settings, and product context.
8. The rest of the generation flow is unchanged: images are planned after the draft, images are stored in R2, and `upsertGeneratedBlog` saves the finished post.

## Important Behavior

- Repurposing uses the same topic status flow as normal writing.
- Repurposing an already-written topic replaces that topic's saved blog because generated blogs are upserted by `topicId`.
- The pasted source is sent to the generation route but is not saved as a separate field in Convex.
- Empty pasted text is blocked in the dialog.
- Pasted text is limited to 40,000 characters by the API route.

## Relevant Code

- `src/features/workspace/components/TopicRepurposeButton.tsx`
- `src/features/workspace/components/TopicRepurposeDialog.tsx`
- `src/features/workspace/components/TopicRow.tsx`
- `src/features/workspace/types/WriteBlogOptions.ts`
- `src/features/workspace/hooks/useLiveWorkspace.ts`
- `src/features/workspace/hooks/useDemoWorkspace.ts`
- `src/app/api/blogs/generate/schema.ts`
- `src/server/blog/generateBlogForKeyword.ts`
- `src/server/blog/writeBlogDraft.ts`
- `src/server/blog/buildBlogWriterPrompt.ts`
- `src/server/blog/buildRepurposedSourcePrompt.ts`

## File Tree

```text
src/features/workspace/components/
src/features/workspace/hooks/
src/features/workspace/types/
src/app/api/blogs/generate/
src/server/blog/
docs/blog-repurposing.md
```
