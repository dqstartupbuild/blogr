import type { DownloadedImage } from "./types/DownloadedImage";

export const replaceImageUrlsInMdx = (
  mdx: string,
  downloadedImages: DownloadedImage[],
) => {
  return downloadedImages.reduce(
    (current, image) => current.split(image.originalUrl).join(`./${image.localPath}`),
    mdx,
  );
};
