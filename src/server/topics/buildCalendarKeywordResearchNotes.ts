import type { TopicCandidate } from "./types/TopicCandidate";
import type { SerpSignal } from "./types/SerpSignal";

type BuildCalendarKeywordResearchNotesOptions = {
  candidate: TopicCandidate;
  signal: SerpSignal;
};

export const buildCalendarKeywordResearchNotes = ({
  candidate,
  signal,
}: BuildCalendarKeywordResearchNotesOptions) => {
  const questions = signal.peopleAlsoAsk.slice(0, 6);
  const relatedSearches = signal.relatedSearches.slice(0, 6);
  const sources = signal.organicResults.slice(0, 6);

  return [
    `Search brief for: ${candidate.keyword}`,
    "",
    candidate.intent ? `Reader need: ${candidate.intent}` : "",
    "",
    "Writing direction:",
    `- Answer "${candidate.keyword}" directly near the beginning.`,
    "- Use the questions and related searches below where they genuinely help.",
    "- Connect the useful advice to the product without forcing it.",
    "",
    ...(questions.length > 0
      ? [
          "Questions people also ask:",
          ...questions.map((question) => `- ${question}`),
          "",
        ]
      : []),
    ...(relatedSearches.length > 0
      ? [
          "Related searches:",
          ...relatedSearches.map((search) => `- ${search}`),
          "",
        ]
      : []),
    ...(sources.length > 0
      ? [
          "Ranking sources to review:",
          ...sources.map((source) => `- ${source.title}: ${source.url}`),
        ]
      : []),
  ]
    .filter((line, index, lines) => line || lines[index - 1] !== "")
    .join("\n")
    .trim();
};
