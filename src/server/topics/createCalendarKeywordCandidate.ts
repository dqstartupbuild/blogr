import { buildCalendarKeywordCandidateNotes } from "./buildCalendarKeywordCandidateNotes";
import { createTopicCandidate } from "./createTopicCandidate";
import { isUsableCalendarKeyword } from "./isUsableCalendarKeyword";
import type { CalendarKeywordSuggestion } from "./types/CalendarKeywordSuggestion";

export const createCalendarKeywordCandidate = (
  suggestion: CalendarKeywordSuggestion,
) => {
  if (!isUsableCalendarKeyword(suggestion.keyword)) {
    return null;
  }

  return createTopicCandidate({
    intent: suggestion.readerNeed,
    keyword: suggestion.keyword,
    notes: buildCalendarKeywordCandidateNotes(suggestion),
    sourceType: "discovery",
  });
};
