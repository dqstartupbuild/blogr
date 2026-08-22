import type { LinkItem } from "../types/LinkItem";

export const isLinkActive = (link: LinkItem) => link.isActive !== false;
