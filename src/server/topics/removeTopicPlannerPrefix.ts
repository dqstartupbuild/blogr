export const removeTopicPlannerPrefix = (keyword: string) => {
  return keyword
    .replace(/^\s*cover\s+this\s+gap\s*:?\s*/i, "")
    .replace(/^\s*review\s+difficulty\s+for\s+/i, "")
    .replace(/^\s*improve\s+ai\s+answer\s+coverage\s+for\s+/i, "")
    .replace(/^\s*refresh\s+/i, "")
    .replace(/^\s*plan\s+a\s+.+?\s+cluster\s*:?\s*/i, "")
    .trim();
};
