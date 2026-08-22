import type { AssociateBrandLink } from "@/features/workspace/types/AssociateBrandLink";

export const buildAssociateBrandLinksPrompt = (
  links: AssociateBrandLink[],
) => {
  if (links.length === 0) {
    return "Associate brand links: none.";
  }

  return `
Associate brand links to mention only when they genuinely help the reader:
${JSON.stringify(links, null, 2)}

Use the description to decide when each link fits. Do not force these links into sections where they are not useful.
`.trim();
};
