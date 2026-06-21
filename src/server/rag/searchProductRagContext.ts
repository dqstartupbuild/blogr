import { fetchAction } from "convex/nextjs";
import { getOptionalConvexAuthToken } from "../auth/getOptionalConvexAuthToken";
import { isAuthDisabledForPreview } from "../auth/isAuthDisabledForPreview";
import { castProductId } from "../convex/castProductId";
import { hasConvexUrl } from "../convex/hasConvexUrl";
import { searchProductContextAction } from "../convex/references/searchProductContextAction";

type SearchProductRagContextOptions = {
  productId?: string;
  query: string;
  token?: string;
};

export const searchProductRagContext = async ({
  productId,
  query,
  token,
}: SearchProductRagContextOptions) => {
  if (!hasConvexUrl() || !productId) {
    return "";
  }

  try {
    const authToken = token ?? (await getOptionalConvexAuthToken());

    if (!authToken && !isAuthDisabledForPreview()) {
      return "";
    }

    const result = await fetchAction(
      searchProductContextAction,
      {
        productId: castProductId(productId),
        query,
      },
      { token: authToken },
    );

    return result.text;
  } catch {
    return "";
  }
};
