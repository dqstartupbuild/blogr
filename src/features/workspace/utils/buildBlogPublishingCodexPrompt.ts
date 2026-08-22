import { blogPublishingPayloadExample } from "../constants/publishing/blogPublishingPayloadExample";
import { blogPublishingReceiverEndpoint } from "../constants/publishing/blogPublishingReceiverEndpoint";
import { blogPublishingReceiverEnvVar } from "../constants/publishing/blogPublishingReceiverEnvVar";

export const buildBlogPublishingCodexPrompt = (productName: string) => {
  const productLabel = productName.trim() || "this product";

  return `Use $blogr-publishing-receiver if that Codex skill is installed. If the skill is not installed, keep going and follow this brief.

Build a Blogr publishing receiver for ${productLabel} in this Next.js App Router app. For this setup, use Convex for article records and Cloudflare R2 for copied article images.

Blogr sends finished posts when I click Publish. Add a public, token-protected webhook endpoint at:

POST ${blogPublishingReceiverEndpoint}

Auth:
- Read the Authorization header.
- Require Bearer <token>.
- Compare the token to the server-only env var below.
- Return 401 with { "error": "Invalid access token." } when the token is missing or wrong.

Required webhook token env var:
${blogPublishingReceiverEnvVar}

Expected payload:
${blogPublishingPayloadExample}

Implementation brief:
- Implement the route in src/app/api/webhooks/blog-publisher/route.ts.
- The route must own the full flow: validate the token, parse the payload, copy images to R2, rewrite article image URLs, upsert Convex records, refresh cached blog pages, and return JSON.
- Handle event_type "publish_articles" by saving every item in data.articles.
- Support event_type "update_article" with data.article.
- Match an existing post by the stable Blogr article id first, then by slug for older records.
- Publishing the same blog again must update the existing canonical article and every related summary/read-model record without creating a duplicate.
- Store content_mdx as the source of truth, falling back to content_markdown.
- Save title, seo_title, meta_description, body, images, tags, source, created_at, and updated_at from the payload when creating an article.
- On update_article, preserve the existing article's original created_at and replace updated_at with the latest payload value.
- Store seo_title separately from the visible article title.
- Copy image_url, markdown image URLs, and any frontmatter featureImage URL into Cloudflare R2 before saving. Rewrite saved body/image fields to target-owned URLs or keys.
- Use safe image fetching: http/https only, timeout, image content-type check, and a reasonable file-size limit.
- Do not hotlink Blogr image URLs.
- Use ConvexHttpClient from the route with CONVEX_URL or NEXT_PUBLIC_CONVEX_URL on .convex.cloud.
- Do not forward to Convex HTTP actions, Convex http.ts, .convex.site, or another proxy route.
- Do not add CONVEX_SITE_URL or NEXT_PUBLIC_CONVEX_SITE_URL for this integration.
- Do not store production articles or media in local files, checked-in JSON, memory, or serverless temp paths.
- Do not require R2_TOKEN, R2_PUBLIC_URL, a public bucket, whole-bucket public access, or an R2 custom domain.
- Add lightweight Convex summary/read-model records for blog lists, sitemap/feed metadata, search/filter data, and static params. Do not load full article bodies for discovery views.
- Add or reuse /blog and /blog/[slug] pages.
- Render Blogr MDX safely: strip frontmatter, support headings, links, lists, blockquotes, tables, code, markdown images, H2-H6 table of contents, stable heading IDs, and whitelisted YouTube embeds including multiline iframe blocks.
- Include webhook-published posts in metadata, sitemap, feed if present, and cached blog data. Revalidate or refresh relevant routes after publish.
- Revalidate the article page, blog index, sitemap, and feed after both creates and updates.
- Keep the token server-only. Do not expose it in browser code.
- Return 200 with { "message": "Published." } after a successful publish.
- Add focused docs for the webhook, env vars, file tree, and testing.
- Add tests for bearer auth, payload validation, stable-id and slug upserts, update_article content and SEO updates, preserved created_at, refreshed updated_at, exactly one saved article after republishing, R2 image copy/rewrite, MDX rendering, YouTube embeds, and sitemap/feed inclusion when those outputs exist.
- Run lint, typecheck, and build before finishing.

Final response requirements:
- Include a clear Required setup section.
- Name every hosting/server env var: BLOG_PUBLISH_WEBHOOK_TOKEN, CONVEX_URL or NEXT_PUBLIC_CONVEX_URL, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_ENDPOINT, R2_BUCKET, plus any site URL the implementation needs.
- Include Convex setup and deployment steps.
- Include Cloudflare R2 bucket and S3-compatible access key steps.
- Include Blogr Settings values: webhook URL, access token, and publisher label. Explain that publisher label becomes the payload source value, not the article author.
- List verification commands you ran and anything still needed after deployment.
- Do not finish with vague wording like "set the needed env vars."`;
};
