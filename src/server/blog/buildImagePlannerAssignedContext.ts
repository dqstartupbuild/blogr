import { extractMdxSections } from "./extractMdxSections";
import type { BlogImagePromptPlan } from "./types/BlogImagePromptPlan";

export const buildImagePlannerAssignedContext = (
  mdx: string,
  assignments: BlogImagePromptPlan[],
) => {
  const sections = extractMdxSections(mdx);
  const firstHeadingOffset = mdx.search(/^##\s+/m);
  const introduction = mdx
    .slice(0, firstHeadingOffset < 0 ? mdx.length : firstHeadingOffset)
    .replace(/^---[\s\S]*?---\s*/m, "")
    .trim();

  return {
    articleOutline: sections.map((section) => ({
      sectionHeading: section.heading,
      sectionIndex: section.index,
    })),
    assignedLocations: assignments.map((assignment) => ({
      articleText:
        typeof assignment.sectionIndex === "number"
          ? sections[assignment.sectionIndex]?.body || ""
          : introduction,
      sectionHeading: assignment.sectionHeading,
      sectionIndex: assignment.sectionIndex,
    })),
  };
};
