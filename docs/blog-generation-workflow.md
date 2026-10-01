# Generate an article

Open a saved topic and choose **Write blog**. Blogr uses the product profile, writing settings, available research, and configured AI providers to produce MDX and images. The article is saved to the local workspace before the request reports success. Generated images are stored in `BLOGR_HOME/media` and served by the same-origin local API.

AI writing needs a configured Replicate writer model and network access. Research and video sources use their optional provider keys. The writer does not require a hosted database or account. If the product, topic, or article changes while generation runs, Blogr refuses to replace the newer work. Regenerating an article archives the prior article in version history; manual edits change the current article.

To write without provider keys, [start a blank article](manual-article-creation.md). See [Local Blogger application](local-application.md) for persistence and backup details.

Relevant code: `src/app/api/blogs/generate/route.ts`, `src/server/blog/generateBlogForKeyword.ts`, and `src/local/server/actions/upsertGeneratedBlog.ts`.
