export const selectDistributedMdxHeadings = (
  headings: string[],
  count: number,
) => {
  if (count <= 0 || headings.length === 0) {
    return [];
  }

  if (count === 1) {
    return [headings[Math.floor(headings.length / 2)]].filter(
      (heading): heading is string => Boolean(heading),
    );
  }

  const selectedIndexes = Array.from({ length: count }, (_, index) =>
    Math.round((index * (headings.length - 1)) / (count - 1)),
  );

  return Array.from(new Set(selectedIndexes))
    .map((index) => headings[index])
    .filter((heading): heading is string => Boolean(heading));
};
