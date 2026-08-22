import { getImageUrlPathKey } from "./getImageUrlPathKey";
import { getMarkdownImageUrls } from "./getMarkdownImageUrls";

type GetBlogImageSectionHeadingOptions = {
  mdx: string;
  url: string;
};

export const getBlogImageSectionHeading = ({
  mdx,
  url,
}: GetBlogImageSectionHeadingOptions) => {
  const targetPathKey = getImageUrlPathKey(url);
  const lines = mdx.split("\n");
  const imageLineIndex = lines.findIndex((line) =>
    getMarkdownImageUrls(line).some(
      (imageUrl) =>
        imageUrl === url || getImageUrlPathKey(imageUrl) === targetPathKey,
    ),
  );

  if (imageLineIndex < 0) {
    return "";
  }

  for (let lineIndex = imageLineIndex - 1; lineIndex >= 0; lineIndex -= 1) {
    const match = lines[lineIndex]?.match(/^##\s+(.+)$/);

    if (match?.[1]) {
      return match[1].trim();
    }
  }

  return "";
};
