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
- Store content_mdx as the source of truth, falling back to content_markdown.
- Treat image_url and all image URLs inside content_mdx/content_markdown as temporary source URLs, not durable public URLs.
- During the webhook request, download every article image the target app needs: image_url, markdown image URLs, and any frontmatter featureImage URL.
- Store downloaded images in this app's own durable public storage, or in the existing media/object storage system if one already exists.
- Rewrite image_url, frontmatter featureImage, and every markdown image URL in the saved body to the target app's stored image URLs before saving the post.
- Preserve image alt text from markdown image syntax where possible.
- Use safe server-side image fetching: allow only http/https URLs, verify image content types, set a timeout, enforce a reasonable file-size limit, and fail with a clear 400 if required images cannot be copied.
- Do not hotlink Blogr image URLs in public pages; Blogr image URLs can be signed and expire.
- Render Blogr's MDX/markdown body well: strip YAML frontmatter from visible content, support headings, paragraphs, bold/italic, links, lists, blockquotes, tables, horizontal rules, inline code, fenced code blocks, and markdown images.
- Make every heading (H2, H3, etc.) anchor-friendly: add a stable, URL-safe ID attribute to each heading (e.g., slugify the heading text) so links like #my-heading work.
- Implement smooth scroll-to-section when users click any table-of-contents anchor or any link with a hash fragment href (e.g., <a href="#my-heading"> or the browser's auto-generated anchor links). Use scrollIntoView with behavior: 'smooth' and block: 'start'. The scroll should work on client-side navigation (React Router/Navigation) and on full page loads alike — on full page loads, read window.location.hash and scroll after the page renders.
- Include a generated table-of-contents component or markup at the top of each article (before the first heading) so readers can jump to any section with one click. Link each TOC entry to the corresponding heading ID via hash href.
- Support Blogr's YouTube output. Render raw iframe embeds that use youtube.com/embed or youtube-nocookie.com/embed safely, and convert standalone YouTube markdown links or watch URLs into embedded players.
- Sanitize rendered content so unsafe scripts or arbitrary event handlers cannot run.
- Add or reuse /blog and /blog/[slug] pages so published posts are visible.
- Make webhook-published posts part of SEO/discovery outputs: sitemap lastmod entries, RSS/feed output if the app has one, and any existing blog index/search/static params metadata flow.
- Revalidate or refresh /blog, /blog/[slug], sitemap, feed, and related cached data after each successful webhook publish when the framework caches those routes.
- Keep the token server-only. Do not expose it in browser code.
- Return 200 with { "message": "Published." } after a successful publish.
- Add focused docs for the webhook, env var, file tree, and how to test it.
- Add tests for bearer auth, payload validation, slug upserts, image download/storage/rewrite, MDX rendering, YouTube embeds, and sitemap/feed inclusion.
- Run lint, typecheck, and build before finishing.`;
};
