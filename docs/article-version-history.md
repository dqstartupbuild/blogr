# Read earlier generated articles

When you run **Write blog** again for a topic that already has an article, Blogr saves the prior article as a numbered, read-only version. Open **Version history** from the article preview or editor to read it. Manual text and image edits change the current article without creating a version.

Versions are saved with the article in the local workspace and included in backup exports. Deleting an article also deletes its versions. Deleting a topic keeps its article and versions.

Relevant code: `src/local/server/archiveBlogVersion.ts`, `src/local/server/actions/upsertGeneratedBlog.ts`, and `src/features/workspace/components/ArticleVersionHistoryDialog.tsx`.
