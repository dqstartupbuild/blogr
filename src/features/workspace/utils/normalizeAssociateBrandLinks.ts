import type { AssociateBrandLink } from "../types/AssociateBrandLink";

export const normalizeAssociateBrandLinks = (
  links: AssociateBrandLink[] | undefined,
): AssociateBrandLink[] => {
  return (links || [])
    .map((link) => ({
      description: link.description.trim(),
      title: link.title.trim(),
      url: link.url.trim(),
    }))
    .filter((link) => link.url)
    .slice(0, 5);
};
