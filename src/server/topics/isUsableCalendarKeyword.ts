const blockedKeywordFragments = [
  "buying decision checklist criteria",
  "comparison questions tradeoffs checklist",
  "decision framework scorecard",
  "implementation roadmap milestones",
  "pricing budget questions checklist",
  "roi measurement metrics guide",
  "setup launch checklist steps",
  "weekly review template questions",
  "workflow mistakes warning signs",
];

export const isUsableCalendarKeyword = (keyword: string) => {
  const cleanKeyword = keyword.trim().replace(/\s+/g, " ");
  const words = cleanKeyword.split(" ").filter(Boolean);
  const lowerKeyword = cleanKeyword.toLowerCase();

  return (
    cleanKeyword.length >= 3 &&
    cleanKeyword.length <= 80 &&
    words.length >= 2 &&
    words.length <= 10 &&
    !blockedKeywordFragments.some((fragment) => lowerKeyword.includes(fragment))
  );
};
