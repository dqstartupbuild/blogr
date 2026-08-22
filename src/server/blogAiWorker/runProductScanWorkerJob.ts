import { scanAndStoreProductWebsite } from "../product/scanAndStoreProductWebsite";
import { indexProductRagContext } from "../rag/indexProductRagContext";
import type { BlogAiWorkerJob } from "./blogAiWorkerJobSchema";

type ProductScanWorkerJob = Extract<
  BlogAiWorkerJob,
  { type: "product.scan" }
>;

export const runProductScanWorkerJob = async ({
  convexAuthToken,
  input,
  userId,
}: ProductScanWorkerJob) => {
  const product = await scanAndStoreProductWebsite({
    niche: input.niche,
    token: convexAuthToken,
    userId,
    websiteUrl: input.websiteUrl,
  });

  await indexProductRagContext({
    product,
    productId: input.productId,
    token: convexAuthToken,
  });

  return { product };
};
