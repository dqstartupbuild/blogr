import { buildProductVisualContext } from "./buildProductVisualContext";
import type { StoredProduct } from "./types/StoredProduct";

type BuildBlogImagePromptOptions = {
  imageJob: string;
  keyword: string;
  product: StoredProduct;
  scene: string;
};

export const buildBlogImagePrompt = ({
  imageJob,
  keyword,
  product,
  scene,
}: BuildBlogImagePromptOptions) => {
  const context = buildProductVisualContext(product);

  return `
Create one image for a long blog post.

Topic: ${keyword}
Image job: ${imageJob}
Scene to show: ${scene}

Product context:
${context}

Direction:
- Make the image immediately relevant to the topic and audience.
- Show a believable moment a real reader would recognize.
- Keep one clear focal point.
- Use a clean editorial style with natural light and realistic details.
- Use the product's brand colors as small accents when colors are provided.
- Do not include readable text, fake UI text, charts with words, captions, watermarks, random symbols, or unrelated objects.
- Do not make a vague metaphor; make the scene clearly connect to the topic.
`.trim();
};
