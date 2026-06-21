import type { BlogImage } from "./types/BlogImage";
import type { ResearchSource } from "./types/ResearchSource";
import type { StoredProduct } from "./types/StoredProduct";
import { buildBlogGenerationSettingsPrompt } from "./buildBlogGenerationSettingsPrompt";
import type { BlogGenerationSettings } from "@/features/workspace/types/BlogGenerationSettings";
import type { LinkItem } from "@/features/workspace/types/LinkItem";

type BuildBlogWriterPromptOptions = {
  images: BlogImage[];
  internalLinks: LinkItem[];
  keyword: string;
  product: StoredProduct;
  settings: BlogGenerationSettings;
  sources: ResearchSource[];
  youtubeVideos: LinkItem[];
};

export const buildBlogWriterPrompt = ({
  images,
  internalLinks,
  keyword,
  product,
  settings,
  sources,
  youtubeVideos,
}: BuildBlogWriterPromptOptions) => {
  return `
Return exactly this XML shape with no markdown fence and no extra text:
<title>human blog title</title>
<slug>url-safe-slug</slug>
<excerpt>short plain-English summary</excerpt>
<mdx>
full MDX blog post
</mdx>

Write a longform blog post for the keyword: "${keyword}".

Voice:
- Human, simple, relatable, and useful.
- Do not sound robotic.
- Avoid jargon unless the topic truly needs it.
- Explain every idea like the reader is smart but busy.
- The post should feel complete, not thin.
- Do not write like a textbook, brochure, or AI assistant.
- Make it clear enough for a beginner.
- Use technical detail only when the keyword truly needs technical detail.

Product context:
${JSON.stringify(product, null, 2)}

${buildBlogGenerationSettingsPrompt(settings)}

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
- Put the feature image URL in frontmatter as featureImage.
- Use the feature image as a markdown image at most once.
- Use each supporting image as a markdown image at most once.
- Never repeat the same image URL in the MDX body.
- Place supporting images near sections that match their alt text and purpose.
- If only one image is available, use it once and do not repeat it.
- Use one H1.
- Include a direct answer near the top.
- Use short paragraphs.
- Use practical examples.
- Add image markdown after the intro and throughout the post when image URLs are available.
- Cite sources as normal markdown links inside relevant sections.
- Include the provided internal links naturally, not as a list unless it truly fits.
- Write one complete MDX file, not an outline and not separate files.
- Aim for 1,800 to 3,000 words when the topic can support it.
`.trim();
};
