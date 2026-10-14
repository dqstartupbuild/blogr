import type { CalendarKeywordSuggestion } from "./types/CalendarKeywordSuggestion";

export const buildCalendarKeywordCandidateNotes = ({
  keyword,
  readerNeed,
  reason,
}: CalendarKeywordSuggestion) => {
  return [
    `Keyword idea: ${keyword}`,
    "",
    `Reader need: ${readerNeed}`,
    `Why it fits: ${reason}`,
    "",
    "Run Find brief before writing to research this keyword.",
  ].join("\n");
};
