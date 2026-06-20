import type { BlogImage } from "./types/BlogImage";
import type { ResearchSource } from "./types/ResearchSource";
import type { StoredProduct } from "./types/StoredProduct";
import type { LinkItem } from "@/features/workspace/types/LinkItem";

type BuildBlogWriterPromptOptions = {
  images: BlogImage[];
  internalLinks: LinkItem[];
  keyword: string;
  product: StoredProduct;
  sources: ResearchSource[];
  youtubeVideos: LinkItem[];
};

export const buildBlogWriterPrompt = ({
  images,
  internalLinks,
  keyword,
  product,
  sources,
  youtubeVideos,
}: BuildBlogWriterPromptOptions) => {
  return `
Return only JSON with this shape:
{
  "title": "human blog title",
  "slug": "url-safe-slug",
  "excerpt": "short plain-English summary",
  "mdx": "full MDX blog post"
}

Write a longform blog post for the keyword: "${keyword}".

Voice:
- Human, simple, relatable, and useful.
- Do not sound robotic.
- Avoid jargon unless the topic truly needs it.
- Explain every idea like the reader is smart but busy.
- The post should feel complete, not thin.

Product context:
${JSON.stringify(product, null, 2)}

Research sources to use and cite:
${JSON.stringify(sources, null, 2)}

Internal links to include naturally:
${JSON.stringify(internalLinks, null, 2)}

YouTube videos to mention only if they fit naturally:
${JSON.stringify(youtubeVideos, null, 2)}

Images to lace through the post:
${JSON.stringify(images, null, 2)}

MDX rules:
- Include frontmatter with title, description, targetKeyword, featureImage, and image alt text when available.
- Use one H1.
- Include a direct answer near the top.
- Use short paragraphs.
- Use practical examples.
- Add image markdown after the intro and throughout the post when image URLs are available.
- Cite sources as normal markdown links inside relevant sections.
- Include 3 to 5 internal links naturally, not as a list unless it truly fits.
- Finish with a simple next step related to the product.
`.trim();
};
