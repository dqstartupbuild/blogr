export const isComparisonTopic = (text: string) => {
  const normalized = text.toLowerCase();

  return (
    normalized.includes(" vs ") ||
    normalized.includes(" versus ") ||
    normalized.includes("alternatives") ||
    normalized.includes("compare") ||
    normalized.startsWith("best ")
  );
};
