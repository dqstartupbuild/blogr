import type { SerpAiAnswer } from "./SerpAiAnswer";
import type { SerpOrganicResult } from "./SerpOrganicResult";

export type SerpSignal = {
  aiAnswers: SerpAiAnswer[];
  organicResults: SerpOrganicResult[];
  peopleAlsoAsk: string[];
  query: string;
  relatedSearches: string[];
};
