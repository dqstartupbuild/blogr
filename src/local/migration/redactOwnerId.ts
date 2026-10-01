export const redactOwnerId = (text: string, ownerId: string): string => {
  const escaped = ownerId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return text.replace(new RegExp(escaped, "gi"), "[source-owner]");
};
