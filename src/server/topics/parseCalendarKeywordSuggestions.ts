import { calendarKeywordSuggestionsSchema } from "./calendarKeywordSuggestionsSchema";
import { extractJsonObject } from "./extractJsonObject";

export const parseCalendarKeywordSuggestions = (text: string) => {
  return calendarKeywordSuggestionsSchema.parse(
    JSON.parse(extractJsonObject(text)),
  ).keywords;
};
