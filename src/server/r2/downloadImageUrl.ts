import { detectRasterImageFormat } from "../../../shared/raster/detectRasterImageFormat";

type DownloadedImageUrl = {
  body: ArrayBuffer;
  contentType: string;
};

export const downloadImageUrl = async (
  url: string,
): Promise<DownloadedImageUrl | null> => {
  const response = await fetch(url);

  if (!response.ok) {
    return null;
  }

  const body = await response.arrayBuffer();
  const format = detectRasterImageFormat(body);

  if (!format) {
    return null;
  }

  return {
    body,
    contentType: format.contentType,
  };
};
