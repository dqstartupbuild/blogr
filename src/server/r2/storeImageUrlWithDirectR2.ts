import { buildR2ImageKey } from "./buildR2ImageKey";
import { downloadImageUrl } from "./downloadImageUrl";
import { getImageExtensionFromContentType } from "./getImageExtensionFromContentType";
import { getR2ServerEnvironment } from "./getR2ServerEnvironment";
import { getR2SignedImageUrl } from "./getR2SignedImageUrl";
import { putR2ImageObject } from "./putR2ImageObject";
import type { R2ImageCategory } from "./types/R2ImageCategory";
import type { StoredR2Image } from "./types/StoredR2Image";

type StoreImageUrlWithDirectR2Options = {
  category: R2ImageCategory;
  filenameHint?: string;
  url: string;
  userId?: string;
};

export const storeImageUrlWithDirectR2 = async ({
  category,
  filenameHint,
  url,
  userId,
}: StoreImageUrlWithDirectR2Options): Promise<StoredR2Image | null> => {
  const environment = getR2ServerEnvironment();

  if (!environment || !userId) {
    return null;
  }

  const image = await downloadImageUrl(url);

  if (!image) {
    return null;
  }

  const key = buildR2ImageKey({
    category,
    extension: getImageExtensionFromContentType(image.contentType),
    filenameHint,
    userId,
  });

  await putR2ImageObject({
    body: image.body,
    contentType: image.contentType,
    environment,
    key,
  });

  return {
    key,
    url: await getR2SignedImageUrl({ environment, key }),
  };
};
