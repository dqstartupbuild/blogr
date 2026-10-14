import type { LinkItem } from "../types/LinkItem";
import { isLinkActive } from "./isLinkActive";

export const filterActiveLinks = (links: LinkItem[]) => {
  return links.filter(isLinkActive);
};
