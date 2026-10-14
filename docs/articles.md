# Articles

## Writing

**Write blog** on a topic generates an article from the product profile, the topic brief, your [writing settings](settings.md), Google research, internal links, and optional YouTube videos. The writer also plans and creates images. The article is saved before the request reports success. If the product, topic, or article changed while it ran, Blogr won't overwrite the newer work.

Running **Write blog** again archives the previous article as a read-only, numbered entry in **Version history**. Manual edits don't create versions.

**Start blank article** creates an empty draft linked to the topic. It works with no AI or network.

## Editing

The editor saves the title, SEO title, excerpt, and MDX body, with a live preview. Saving checks that nobody changed the article since you started editing. If someone did, you get a conflict message instead of an overwrite.

Each image has a menu with **Regenerate**, **Edit alt text**, **Move in article**, **Make feature image**, and **Remove image**.

## On the Articles page

- **Refresh ideas** researches an existing article and suggests updates you can save as new topics.
- **Publish** sends the article to your blog ([publishing](publishing.md)) and marks it published.
- **Download ZIP** packages the article's MDX, `metadata.json`, and images for use anywhere. It's a single article, not a backup.
- Filter articles by all, unpublished, or published.

Relevant code: `src/app/api/blogs/`, `src/server/blog/generateBlogForKeyword.ts`, `src/features/workspace/hooks/useBlogEditor.ts`, `src/local/server/actions/upsertGeneratedBlog.ts`, and `src/server/download/buildBlogZip.ts`.
