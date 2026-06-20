import { fetchImageForZip } from "./fetchImageForZip";

export const downloadBlogImages = async (urls: string[]) => {
  const images = await Promise.all(
    urls.map((url, index) => fetchImageForZip({ index: index + 1, url })),
  );

  return images.filter((image) => image !== null);
};
