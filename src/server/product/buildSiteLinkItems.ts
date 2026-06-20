import type { LinkItem } from "@/features/workspace/types/LinkItem";

export const buildSiteLinkItems = (links: string[]): LinkItem[] => {
  return links.slice(0, 160).map((url) => {
    const parsed = new URL(url);
    const label = parsed.pathname
      .split("/")
      .filter(Boolean)
      .join(" / ")
      .replace(/[-_]/g, " ");

    return {
      title: label || parsed.hostname.replace(/^www\./i, ""),
      url,
    };
  });
};
