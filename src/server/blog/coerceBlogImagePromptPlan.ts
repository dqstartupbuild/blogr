import type { BlogImagePromptPlan } from "./types/BlogImagePromptPlan";

export const coerceBlogImagePromptPlan = (
  value: unknown,
): BlogImagePromptPlan | null => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const plan = value as Record<string, unknown>;
  const alt = typeof plan.alt === "string" ? plan.alt.trim() : "";
  const prompt = typeof plan.prompt === "string" ? plan.prompt.trim() : "";
  const sectionHeading =
    typeof plan.sectionHeading === "string" ? plan.sectionHeading.trim() : "";

  if (!alt || !prompt) {
    return null;
  }

  return {
    alt,
    prompt,
    sectionHeading,
  };
};
