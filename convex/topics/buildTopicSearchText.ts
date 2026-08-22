export const buildTopicSearchText = ({
  canonicalKeyword,
  intentKey,
  keyword,
  notes,
  scheduledDate,
  sourceType,
}: {
  canonicalKeyword?: string;
  intentKey?: string;
  keyword: string;
  notes?: string;
  scheduledDate?: string;
  sourceType?: string;
}) => {
  return [
    keyword,
    canonicalKeyword || "",
    sourceType || "",
    scheduledDate || "",
    intentKey || "",
    notes || "",
  ]
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
};
