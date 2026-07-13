import type { MdxSection } from "./types/MdxSection";

export const selectDistributedMdxSections = (
  sections: MdxSection[],
  count: number,
) => {
  if (count <= 0 || sections.length === 0) {
    return [];
  }

  const selectionCount = Math.min(count, sections.length);
  const selectedIndexes = Array.from({ length: selectionCount }, (_, index) =>
    Math.min(
      sections.length - 1,
      Math.floor(((index + 0.5) * sections.length) / selectionCount),
    ),
  );

  return Array.from(new Set(selectedIndexes))
    .map((index) => sections[index])
    .filter((section): section is MdxSection => Boolean(section));
};
