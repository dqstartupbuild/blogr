import type { LinkItem } from "@/features/workspace/types/LinkItem";

export const mergeUniqueLinkItems = (items: LinkItem[]) => {
  const seenUrls = new Set<string>();
  const uniqueItems: LinkItem[] = [];

  for (const item of items) {
    if (seenUrls.has(item.url)) {
      continue;
    }

    seenUrls.add(item.url);
    uniqueItems.push(item);
  }

  return uniqueItems;
};
