import type { GoogleSearchScraperRecord } from "../apify/types/GoogleSearchScraperRecord";
import { mapSerpAiAnswer } from "./mapSerpAiAnswer";

export const extractSerpAiAnswers = (record: GoogleSearchScraperRecord) => {
  return [
    mapSerpAiAnswer(record.aiModeResult, "Google AI Mode"),
    mapSerpAiAnswer(record.aiOverview, "Google AI Overview"),
    mapSerpAiAnswer(record.aiOverviewResult, "Google AI Overview"),
    mapSerpAiAnswer(record.chatGptResult, "ChatGPT search"),
    mapSerpAiAnswer(record.perplexityResult, "Perplexity"),
    mapSerpAiAnswer(record.geminiResult, "Gemini"),
    mapSerpAiAnswer(record.copilotResult, "Copilot"),
  ].filter((item) => item !== null);
};
