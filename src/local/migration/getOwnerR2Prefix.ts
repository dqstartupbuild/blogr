export const getOwnerR2Prefix = (ownerId: string): string => {
  const sanitized = ownerId.trim().toLowerCase().replace(/[^a-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
  if (!sanitized) throw new Error("The verified owner ID cannot form an R2 key prefix.");
  return `${sanitized}/`;
};
