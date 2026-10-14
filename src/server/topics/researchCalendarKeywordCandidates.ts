import { runGoogleSearchScraper } from "../apify/runGoogleSearchScraper";
import { buildCalendarKeywordResearchNotes } from "./buildCalendarKeywordResearchNotes";
import { extractSerpSignals } from "./extractSerpSignals";
import type { TopicCandidate } from "./types/TopicCandidate";

export const researchCalendarKeywordCandidates = async (
  candidates: TopicCandidate[],
) => {
  if (candidates.length === 0) {
    return candidates;
  }

  try {
    const records = await runGoogleSearchScraper({
      includeAiMode: false,
      maxQueries: candidates.length,
      queries: candidates.map((candidate) => candidate.keyword),
    });
    const signalsByQuery = new Map(
      extractSerpSignals(records).map((signal) => [
        signal.query.trim().toLowerCase(),
        signal,
      ]),
    );

    return candidates.map((candidate) => {
      const signal = signalsByQuery.get(candidate.keyword.trim().toLowerCase());

      if (!signal) {
        return candidate;
      }

      return {
        ...candidate,
        notes: buildCalendarKeywordResearchNotes({ candidate, signal }),
        sourceSignals: [
          ...signal.peopleAlsoAsk,
          ...signal.relatedSearches,
        ].slice(0, 10),
      };
    });
  } catch {
    return candidates;
  }
};
