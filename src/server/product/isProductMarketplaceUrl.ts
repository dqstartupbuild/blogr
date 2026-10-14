import { productMarketplaceHosts } from "./constants/productMarketplaceHosts";

export const isProductMarketplaceUrl = (value: string) => {
  try {
    const url = new URL(value);
    const hostname = url.hostname.replace(/^www\./i, "").toLowerCase();

    return (
      (url.protocol === "https:" || url.protocol === "http:") &&
      productMarketplaceHosts.some(
        (host) => hostname === host || hostname.endsWith(`.${host}`),
      )
    );
  } catch {
    return false;
  }
};
