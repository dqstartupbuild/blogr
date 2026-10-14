import { isLinkActive } from "./isLinkActive";
import type { LinkItem } from "../types/LinkItem";
import type { ProductLinkFilter } from "../types/ProductLinkFilter";

export const filterProductLinksByStatus = (
  links: LinkItem[],
  filter: ProductLinkFilter,
) => {
  return links.filter((link) =>
    filter === "active" ? isLinkActive(link) : !isLinkActive(link),
  );
};
