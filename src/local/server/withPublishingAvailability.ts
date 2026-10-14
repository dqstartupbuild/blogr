import type { LocalState } from "../domain/LocalState";
import { getBlogPublishToken } from "@/server/publishing/getBlogPublishToken";

export const withPublishingAvailability = (state: LocalState): LocalState => ({
  ...state,
  products: state.products.map((product) => product.blogPublishingIntegration ? {
    ...product,
    blogPublishingIntegration: { ...product.blogPublishingIntegration, hasAccessToken: Boolean(getBlogPublishToken(product.id)) },
  } : product),
});
