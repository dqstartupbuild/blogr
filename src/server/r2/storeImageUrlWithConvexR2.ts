import { fetchAction } from "convex/nextjs";
import { getOptionalConvexAuthToken } from "../auth/getOptionalConvexAuthToken";
import { hasConvexUrl } from "../convex/hasConvexUrl";
import { storeImageFromUrlAction } from "../convex/references/storeImageFromUrlAction";
import type { R2ImageCategory } from "./types/R2ImageCategory";
import type { StoredR2Image } from "./types/StoredR2Image";

type StoreImageUrlWithConvexR2Options = {
  category: R2ImageCategory;
  filenameHint?: string;
  token?: string;
  url: string;
};

export const storeImageUrlWithConvexR2 = async ({
  category,
  filenameHint,
  token,
  url,
}: StoreImageUrlWithConvexR2Options): Promise<StoredR2Image | null> => {
  if (!hasConvexUrl() || !url) {
    return null;
  }

  try {
    const authToken = token ?? (await getOptionalConvexAuthToken());

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
    return null;
  }
};
