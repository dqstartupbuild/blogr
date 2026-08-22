import type { ProductProfile } from "../types/ProductProfile";
import { emptyBlogPublishingIntegration } from "./emptyBlogPublishingIntegration";

export const emptyProduct: ProductProfile = {
  audience: "",
  blogPublishingIntegration: emptyBlogPublishingIntegration,
  colors: ["#000000", "#ffffff"],
  competitors: "",
  description: "Scan your site to pull in the product details.",
  externalLinks: [],
  features: [],
  name: "",
  niche: "",
  offers: [],
  pricing: [],
  siteLinks: [],
  websiteUrl: "",
};
