export const getBlogTagWordPhrases = (tag: string) => {
  const words = tag.split(" ").filter(Boolean);

  if (words.length <= 3) {
    return [];
  }

  return [words.slice(0, 3).join(" "), words.slice(-3).join(" ")];
};
