type GetDistributedHeadingLineIndexOptions = {
  headingLineIndexes: number[];
  imageIndex: number;
  imageCount: number;
};

export const getDistributedHeadingLineIndex = ({
  headingLineIndexes,
  imageIndex,
  imageCount,
}: GetDistributedHeadingLineIndexOptions) => {
  if (headingLineIndexes.length === 0) {
    return null;
  }

  if (imageCount <= 1) {
    return headingLineIndexes[Math.floor(headingLineIndexes.length / 2)] ?? null;
  }

  const position = Math.round(
    (imageIndex * (headingLineIndexes.length - 1)) / (imageCount - 1),
  );

  return headingLineIndexes[position] ?? null;
};
