import type { BlogImagePromptPlan } from "./types/BlogImagePromptPlan";

export const mergeBlogImagePromptPlans = ({
  assignments,
  plans,
}: {
  assignments: BlogImagePromptPlan[];
  plans: BlogImagePromptPlan[];
}): BlogImagePromptPlan[] => {
  return assignments.map((assignment, index) => {
    const plan = plans[index];

    return {
      alt: plan?.alt || assignment.alt,
      prompt: plan?.prompt || assignment.prompt,
      sectionHeading: assignment.sectionHeading,
      sectionIndex: assignment.sectionIndex,
    };
  });
};
