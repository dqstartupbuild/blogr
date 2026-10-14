# Publishing to your blog

Blogr can send finished articles to another app (your public blog) by webhook.

## Set up

1. Put `BLOG_PUBLISH_WEBHOOK_TOKEN` in `.env.local`. You can also set `BLOG_PUBLISH_WEBHOOK_URL`, `BLOG_PUBLISH_SOURCE_NAME`, and `BLOG_PUBLISH_TIMEOUT_MS` (15 seconds by default). The token is never saved in your workspace or backups.
2. In **Settings → Publishing**, use **Copy integration prompt** and give it to whichever coding agent works on your blog's codebase. The prompt points the agent to the [`skills/blogr-publishing-receiver`](../skills/blogr-publishing-receiver/SKILL.md) skill, which works with any agent that can read files, and includes a complete brief in case the agent can't download it.
3. Deploy the receiver, then enter its webhook URL and publisher label in Settings. The label is sent as `source`. It is not the article author.

## What gets sent

**Publish** POSTs `publish_articles` or `update_article` to the receiver with `Authorization: Bearer <token>`. Images stored in Blogr are sent inline as base64: up to 20 images, 2 MB combined, and a 4 MB request. The receiver must store them itself and replace the local image references. The article is marked published only after the receiver accepts it. If the receiver succeeds but saving the local status fails, Blogr reports success with a warning, so a retry won't duplicate the post.

The receiver skill targets Next.js App Router with Convex and Cloudflare R2, and explains how to adapt to other stacks. Keep the skill, `buildBlogPublishingIntegrationPrompt.ts`, and `src/server/publishing/` in sync when the payload changes.

Relevant code: `src/app/api/blogs/publish/route.ts`, `src/server/publishing/`, and `src/features/workspace/utils/buildBlogPublishingIntegrationPrompt.ts`.
