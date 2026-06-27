export const splitBlogTagText = (value: string) => {
  return value
    .split(/\n|[|;:?!.,()[\]{}]+|\s+-\s+|\s+vs\.?\s+|\s+versus\s+/i)
    .map((part) => part.trim())
    .filter(Boolean);
};
