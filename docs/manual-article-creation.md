# Start a blank article

Open a topic and choose **Start blank article**. Blogr creates a real draft linked to that topic and opens its preview. Open the editor to write the title, SEO title, excerpt, and MDX. Saving writes to the local workspace under `BLOGR_HOME`; the article and its images are included in backups.

This path works without AI, research keys, an account, or network access. It is available for a topic that does not already have an article. The **Write blog** action remains the separate AI generation path.

Relevant code: `src/features/workspace/components/CreateBlankArticleButton.tsx`, `src/local/server/actions/upsertGeneratedBlog.ts`, and `src/features/workspace/hooks/useBlogEditor.ts`.
