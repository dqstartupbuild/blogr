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

  const contentType = response.headers.get("content-type") || "image/png";

  if (!contentType.startsWith("image/")) {
    return null;
  }

  return {
    body: await response.arrayBuffer(),
    contentType,
  };
};
