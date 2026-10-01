# Edit an article

The article editor saves the title, SEO title, excerpt, and MDX to the local workspace. Its preview renders the current MDX. Image controls can update or regenerate saved images. A blank article can be created from a topic without an AI provider.

The editor keeps an unsaved draft visible when another tab refreshes the workspace. Saving checks the article version captured when editing began and reports a conflict instead of overwriting newer work. An image edit made by this editor advances the draft's expected version. Article ZIP download includes the current editor draft and managed image bytes.

Relevant code: `src/features/workspace/hooks/useBlogEditor.ts`, `src/features/workspace/components/BlogEditorView.tsx`, and `src/local/server/actions/updateBlogContent.ts`.
