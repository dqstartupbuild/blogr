import type { LinkItem } from "@/features/workspace/types/LinkItem";
import { escapeMarkdownLinkLabel } from "./escapeMarkdownLinkLabel";

export const buildMarkdownLink = (link: LinkItem) => {
  return `[${escapeMarkdownLinkLabel(link.title)}](${link.url})`;
};
