import { normalizeMdxHeadingText } from "./normalizeMdxHeadingText";

type FindMdxHeadingLineIndexOptions = {
  headingLineIndexes: number[];
  lines: string[];
  sectionHeading?: string;
  sectionIndex?: number;
};

export const findMdxHeadingLineIndex = ({
  headingLineIndexes,
  lines,
  sectionHeading,
  sectionIndex,
}: FindMdxHeadingLineIndexOptions) => {
  if (
    typeof sectionIndex === "number" &&
    sectionIndex >= 0 &&
    sectionIndex < headingLineIndexes.length
  ) {
    return headingLineIndexes[sectionIndex] ?? null;
  }

  const target = normalizeMdxHeadingText(sectionHeading || "");

  if (!target) {
    return null;
  }

  const exactMatch = headingLineIndexes.find(
    (lineIndex) => normalizeMdxHeadingText(lines[lineIndex] || "") === target,
  );

  if (typeof exactMatch === "number") {
    return exactMatch;
  }

  return (
    headingLineIndexes.find((lineIndex) => {
      const candidate = normalizeMdxHeadingText(lines[lineIndex] || "");

      return candidate.includes(target) || target.includes(candidate);
    }) ?? null
  );
};
