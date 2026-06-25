import { getImageUrlPathKey } from "./getImageUrlPathKey";
import { getMarkdownImageUrls } from "./getMarkdownImageUrls";

type ReplaceImageUrlInMdxOptions = {
  mdx: string;
  nextUrl: string;
  previousUrl?: string;
};

export const replaceImageUrlInMdx = ({
  mdx,
  nextUrl,
  previousUrl,
}: ReplaceImageUrlInMdxOptions) => {
  if (!previousUrl || previousUrl === nextUrl) {
    return mdx;
  }

  if (mdx.includes(previousUrl)) {
    return mdx.split(previousUrl).join(nextUrl);
  }

  const previousPathKey = getImageUrlPathKey(previousUrl);

  if (!previousPathKey) {
    return mdx;
  }

  const matchingUrl = getMarkdownImageUrls(mdx).find(
    (url) => getImageUrlPathKey(url) === previousPathKey,
  );

  if (!matchingUrl) {
    return mdx;
  }

  return mdx.split(matchingUrl).join(nextUrl);
};