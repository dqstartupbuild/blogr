import { blogPublishingPayloadExample } from "../constants/publishing/blogPublishingPayloadExample";
import { blogPublishingReceiverEndpoint } from "../constants/publishing/blogPublishingReceiverEndpoint";
import { blogPublishingReceiverEnvVar } from "../constants/publishing/blogPublishingReceiverEnvVar";

export const buildBlogPublishingCodexPrompt = (productName: string) => {
  const productLabel = productName.trim() || "this product";

  return `Build a blog publishing receiver for ${productLabel}.

Blogr will send finished posts when I click Publish. Add a public, token-protected webhook endpoint at:

POST ${blogPublishingReceiverEndpoint}

Auth:
- Read the Authorization header.
- Require Bearer <token>.
- Compare the token to the server-only env var below.
- Return 401 with { "error": "Invalid access token." } when the token is missing or wrong.

Required env var:
${blogPublishingReceiverEnvVar}

Expected payload:
${blogPublishingPayloadExample}

Behavior:
- Handle event_type "publish_articles" by saving every item in data.articles.
- Also support event_type "update_article" with data.article for future updates.
- Upsert posts by slug so publishing the same blog again updates the existing page.
- On every create or update, save the current title, seo_title, meta_description, content, images, tags, source, created_at, and updated_at values from the payload.
- Store seo_title as a separate SEO metadata title, not as the visible article title.
- Keep seo_title between 70 and 110 characters and meta_description between 110 and 160 characters.
- Store content_mdx as the source of truth, falling back to content_markdown.
- Treat image_url and all image URLs inside content_mdx/content_markdown as temporary source URLs, not durable public URLs.
- Before implementing storage, inspect the repo for an existing durable database and existing durable media/object storage.
- If both already exist, reuse the existing systems and follow their local patterns.
- If either one is missing, ask the user which database and object storage they prefer before building that part. Present Convex for article records and Cloudflare R2 through the Convex R2 component as the recommended default.
- If the user says to choose, does not care, or asks for the default, use Convex for blog article records and Cloudflare R2 through @convex-dev/r2 for object storage.
- Never implement production article or media storage with local writable files, checked-in JSON, in-memory state, or any serverless/ephemeral filesystem path.
- When using the Convex R2 component, install @convex-dev/r2, add it to convex/convex.config.ts with app.use(r2), create an R2 client from components.r2, store downloaded images from a Convex action with r2.store, save returned object keys on article records, and serve images by resolving keys with r2.getUrl.
- Document required Convex/R2 env vars when that default is used: R2_TOKEN, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_ENDPOINT, and R2_BUCKET.
- Do not require R2_PUBLIC_URL, an R2 custom domain, a public bucket, or whole-bucket public access. Prefer signed URLs from the existing storage layer or @convex-dev/r2's r2.getUrl. Only add public access when the user explicitly asks for that tradeoff.
- During the webhook request, download every article image the target app needs: image_url, markdown image URLs, and any frontmatter featureImage URL.
- Store downloaded images in durable object storage, preferring the existing media/object storage system when one exists and otherwise the selected/default object storage above.
- Rewrite image_url, frontmatter featureImage, and every markdown image URL in the saved body to the target app's stored image URLs before saving the post.
- Preserve image alt text from markdown image syntax where possible.
- Use safe server-side image fetching: allow only http/https URLs, verify image content types, set a timeout, enforce a reasonable file-size limit, and fail with a clear 400 if required images cannot be copied.
- Do not hotlink Blogr image URLs in public pages; Blogr image URLs can be signed and expire.
- Render Blogr's MDX/markdown body well: strip YAML frontmatter from visible content, support H1 through H6 headings, paragraphs, bold/italic, links, lists, blockquotes, tables, horizontal rules, inline code, fenced code blocks, and markdown images.
- Make every rendered heading from H1 through H6 anchor-friendly: add a stable, URL-safe ID attribute to each heading (e.g., slugify the heading text) so links like #my-heading work.
- Implement smooth scroll-to-section when users click any table-of-contents anchor or any link with a hash fragment href (e.g., <a href="#my-heading"> or the browser's auto-generated anchor links). Use scrollIntoView with behavior: 'smooth' and block: 'start'. The scroll should work on client-side navigation (React Router/Navigation) and on full page loads alike — on full page loads, read window.location.hash and scroll after the page renders.
- Include a generated table-of-contents component or markup near the top of each article so readers can jump to article sections with one click. Build the table of contents from H2 through H6 headings only, not from the article H1. Link each TOC entry to the corresponding heading ID via hash href.
- Support Blogr's YouTube output. Blogr can send raw iframe embeds in content_mdx with attributes spread over multiple lines, for example an opening <iframe line, width/height/src/title/allow attributes on separate lines, and a closing </iframe>. It may also receive self-closing iframe variants from older content. Do not only parse one-line iframe strings. Render iframe embeds that use youtube.com/embed or youtube-nocookie.com/embed safely, and convert standalone YouTube markdown links or watch URLs into embedded players.
- If the markdown/MDX renderer would show raw iframe text, add an explicit safe transform or whitelisted iframe renderer for Blogr's YouTube iframe shape before display.
- Sanitize rendered content so unsafe scripts or arbitrary event handlers cannot run.
- Add or reuse /blog and /blog/[slug] pages so published posts are visible.
- Make webhook-published posts part of SEO/discovery outputs: sitemap lastmod entries, RSS/feed output if the app has one, and any existing blog index/search/static params metadata flow.
- Revalidate or refresh /blog, /blog/[slug], sitemap, feed, and related cached data after each successful webhook publish when the framework caches those routes.
- Keep the token server-only. Do not expose it in browser code.
- Return 200 with { "message": "Published." } after a successful publish.
- Add focused docs for the webhook, env var, file tree, and how to test it.
- Add tests for bearer auth, payload validation, slug upserts, update_article SEO field updates, image download/storage/rewrite, MDX rendering, YouTube embeds, and sitemap/feed inclusion.
- Run lint, typecheck, and build before finishing.

Before your final response, audit every required setup value and manual step. In your final response, include a clear "Required setup" section with:
- Vercel/hosting/server env vars, including BLOG_PUBLISH_WEBHOOK_TOKEN and any site URL or framework-specific env vars needed by the implementation.
- Convex deployment env vars, including R2_TOKEN, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_ENDPOINT, and R2_BUCKET when Convex R2 is used.
- Database setup steps, including Convex project setup, schema deployment, migrations, seed steps, or commands the user must run.
- Cloudflare/R2 setup steps, including bucket creation, API token creation, CORS policy, and signed URL behavior the implementation expects. Do not require R2_PUBLIC_URL, an R2 custom domain, a public bucket, or whole-bucket public access unless the user explicitly chose that setup.
- Blogr setup steps: webhook URL, access token, and publisher label to enter in Blogr Settings. Explain that the publisher label becomes the payload's source value and is not the article author.
- Any optional env vars or follow-up steps, clearly labeled optional.
- The exact verification commands you ran and anything the user still needs to run after deployment.

Do not finish with vague wording like "set the needed env vars." Name every variable and where it must be set.`;
};
