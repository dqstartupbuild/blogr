import { fetchAction } from "convex/nextjs";
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

  const result = await fetchAction(
    searchProductContextAction,
    {
      productId: castProductId(productId),
      query,
    },
    { token },
  ).catch(() => ({ text: "" }));

  return result.text;
};
