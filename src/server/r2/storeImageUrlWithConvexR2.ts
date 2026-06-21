import { fetchAction } from "convex/nextjs";
import { getOptionalConvexAuthToken } from "../auth/getOptionalConvexAuthToken";
import { isAuthDisabledForPreview } from "../auth/isAuthDisabledForPreview";
import { hasConvexUrl } from "../convex/hasConvexUrl";
import { storeImageFromUrlAction } from "../convex/references/storeImageFromUrlAction";
import { storeImageUrlWithDirectR2 } from "./storeImageUrlWithDirectR2";
import type { R2ImageCategory } from "./types/R2ImageCategory";
import type { StoredR2Image } from "./types/StoredR2Image";

type StoreImageUrlWithConvexR2Options = {
  category: R2ImageCategory;
  filenameHint?: string;
  token?: string;
  url: string;
  userId?: string;
};

export const storeImageUrlWithConvexR2 = async ({
  category,
  filenameHint,
  token,
  url,
  userId,
}: StoreImageUrlWithConvexR2Options): Promise<StoredR2Image | null> => {
  if (!url) {
    return null;
  }

  const authToken = token ?? (await getOptionalConvexAuthToken());

  if (hasConvexUrl() && (authToken || isAuthDisabledForPreview())) {
    try {
      return await fetchAction(
        storeImageFromUrlAction,
        {
          category,
          filenameHint,
          url,
        },
        { token: authToken },
      );
    } catch {
      return await storeImageUrlWithDirectR2({
        category,
        filenameHint,
        url,
        userId,
      }).catch(() => null);
    }
  }

  return await storeImageUrlWithDirectR2({
    category,
    filenameHint,
    url,
    userId,
  }).catch(() => null);
};
