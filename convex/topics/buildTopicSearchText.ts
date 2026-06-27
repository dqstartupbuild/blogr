export const buildTopicSearchText = ({
  keyword,
  notes,
}: {
  keyword: string;
  notes?: string;
}) => {
  return [keyword, notes || ""].join(" ").replace(/\s+/g, " ").trim();
};
