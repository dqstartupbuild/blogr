import { getSignedImageUrlExpirationMs } from "./getSignedImageUrlExpirationMs";

const signedImageUrlRefreshWindowMs = 24 * 60 * 60 * 1000;

export const shouldRefreshSignedImageUrl = (url?: string) => {
  if (!url) {
    return true;
  }

  const expirationMs = getSignedImageUrlExpirationMs(url);

  if (!expirationMs) {
    return true;
  }

  return expirationMs - Date.now() <= signedImageUrlRefreshWindowMs;
};
