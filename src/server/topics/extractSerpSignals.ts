import type { GoogleSearchScraperRecord } from "../apify/types/GoogleSearchScraperRecord";
import { extractSerpAiAnswers } from "./extractSerpAiAnswers";
import { extractSerpOrganicResults } from "./extractSerpOrganicResults";
import { extractSerpPeopleAlsoAsk } from "./extractSerpPeopleAlsoAsk";
import { extractSerpQuery } from "./extractSerpQuery";
import { extractSerpRelatedSearches } from "./extractSerpRelatedSearches";
import type { SerpSignal } from "./types/SerpSignal";

export const extractSerpSignals = (
  records: GoogleSearchScraperRecord[],
): SerpSignal[] => {
  return records
    .map((record) => ({
      aiAnswers: extractSerpAiAnswers(record),
      organicResults: extractSerpOrganicResults(record),
      peopleAlsoAsk: extractSerpPeopleAlsoAsk(record),
      query: extractSerpQuery(record),
      relatedSearches: extractSerpRelatedSearches(record),
    }))
    .filter((signal) => {
      return (
        signal.query ||
        signal.aiAnswers.length > 0 ||
        signal.organicResults.length > 0 ||
        signal.peopleAlsoAsk.length > 0 ||
        signal.relatedSearches.length > 0
      );
    });
};
