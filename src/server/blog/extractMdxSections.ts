import type { MdxSection } from "./types/MdxSection";

export const extractMdxSections = (mdx: string): MdxSection[] => {
  const lines = mdx.split("\n");
  const headingLineIndexes = lines
    .map((line, index) => (/^##\s+/.test(line) ? index : -1))
    .filter((index) => index >= 0);

  return headingLineIndexes.map((lineIndex, index) => ({
    body: lines
      .slice(lineIndex + 1, headingLineIndexes[index + 1] ?? lines.length)
      .join("\n")
      .trim(),
    heading: lines[lineIndex]?.replace(/^##\s+/, "").trim() || "",
    index,
  }));
};
