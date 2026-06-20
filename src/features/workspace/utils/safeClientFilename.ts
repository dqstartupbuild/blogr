export const safeClientFilename = (value: string) => {
  const cleaned = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return cleaned || "blog-post";
};
