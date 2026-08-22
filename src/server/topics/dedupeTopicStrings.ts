export const dedupeTopicStrings = (items: string[]) => {
  const seen = new Set<string>();

  return items.filter((item) => {
    const cleanItem = item.trim().replace(/\s+/g, " ");
    const key = cleanItem.toLowerCase();

    if (!cleanItem || seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
};
