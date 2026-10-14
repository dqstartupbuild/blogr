import type { BlogImage } from "./types/BlogImage";

export const getBlogFeatureImage = (images: BlogImage[]) => {
  const hasSectionAssignments = images.some(
    (image) => typeof image.sectionIndex === "number",
  );

  if (hasSectionAssignments) {
    return images.find((image) => typeof image.sectionIndex !== "number");
  }

  return images[0];
};
