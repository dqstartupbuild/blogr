import type { Doc } from "../_generated/dataModel";
import { sanitizeBlogPublishingIntegration } from "./sanitizeBlogPublishingIntegration";

export const sanitizeProductForClient = (product: Doc<"products">) => {
  return {
    ...product,
    blogPublishingIntegration: sanitizeBlogPublishingIntegration(
      product.blogPublishingIntegration,
    ),
  };
};
