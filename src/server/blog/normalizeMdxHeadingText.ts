export const normalizeMdxHeadingText = (value: string) => {
  return value
    .replace(/^#{1,6}\s+/, "")
    .replace(/[*_`~[\]()]/g, " ")
    .replace(/[^a-z0-9]+/gi, " ")
    .trim()
    .toLowerCase();
};
