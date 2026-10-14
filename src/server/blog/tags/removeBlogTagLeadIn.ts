export const removeBlogTagLeadIn = (value: string) => {
  return value
    .replace(
      /^\s*(cover this gap|search gap|search plan|comparison plan|refresh plan|ai answer plan|difficulty note)\s*:?\s*/i,
      "",
    )
    .replace(/^\s*(review difficulty for|improve ai answer coverage for)\s+/i, "");
};
