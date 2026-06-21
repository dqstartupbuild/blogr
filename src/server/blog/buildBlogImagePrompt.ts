import { buildProductVisualContext } from "./buildProductVisualContext";
import { buildBlogImageStyleDirection } from "./buildBlogImageStyleDirection";
import { buildBlogImageTextDirection } from "./buildBlogImageTextDirection";
import type { BlogGenerationSettings } from "@/features/workspace/types/BlogGenerationSettings";
import type { StoredProduct } from "./types/StoredProduct";

type BuildBlogImagePromptOptions = {
  imageJob: string;
  keyword: string;
  product: StoredProduct;
  scene: string;
  settings: BlogGenerationSettings;
};

export const buildBlogImagePrompt = ({
  imageJob,
  keyword,
  product,
  scene,
  settings,
}: BuildBlogImagePromptOptions) => {
  const context = buildProductVisualContext(product);
  const styleDirection = buildBlogImageStyleDirection(settings.imageStyle);
  const textDirection = buildBlogImageTextDirection({
    imageJob,
    imageStyle: settings.imageStyle,
  });

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
- ${styleDirection}
- Use the product's brand colors as small accents when colors are provided.
- Keep the visual style consistent with the other blog images, but make this image clearly distinct from the feature image.
- ${textDirection}
- Do not make a vague metaphor; make the scene clearly connect to the topic.
`.trim();
};
