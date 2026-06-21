import { getR2ImageUrl } from "./getR2ImageUrl";

type GetR2ImageUrlsOptions = {
  fallbackUrls: string[];
  keys?: string[];
};

export const getR2ImageUrls = async ({
  fallbackUrls,
  keys,
}: GetR2ImageUrlsOptions) => {
  if (!keys?.length) {
    return fallbackUrls;
  }

  const urls = await Promise.all(
    keys.map((key) => getR2ImageUrl(key).catch(() => "")),
  );
  const freshUrls = urls
    .map((url, index) => url || fallbackUrls[index] || "")
    .filter(Boolean);

  return freshUrls.length > 0 ? freshUrls : fallbackUrls;
};
