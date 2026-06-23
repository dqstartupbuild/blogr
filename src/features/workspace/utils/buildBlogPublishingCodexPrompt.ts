import { blogPublishingPayloadExample } from "../constants/publishing/blogPublishingPayloadExample";
import { blogPublishingReceiverEndpoint } from "../constants/publishing/blogPublishingReceiverEndpoint";
import { blogPublishingReceiverEnvVar } from "../constants/publishing/blogPublishingReceiverEnvVar";

export const buildBlogPublishingCodexPrompt = (productName: string) => {
  const productLabel = productName.trim() || "this product";

  return `Build a blog publishing receiver for ${productLabel}.

Blogger will send finished posts when I click Publish. Add a public, token-protected webhook endpoint at:

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
- Use image_url as the feature image when present.
- Add or reuse /blog and /blog/[slug] pages so published posts are visible.
- Keep the token server-only. Do not expose it in browser code.
- Return 200 with { "message": "Published." } after a successful publish.
- Add focused docs for the webhook, env var, file tree, and how to test it.
- Run lint, typecheck, and build before finishing.`;
};
