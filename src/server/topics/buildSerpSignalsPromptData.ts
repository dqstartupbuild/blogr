import { truncateTopicText } from "./truncateTopicText";
import type { SerpSignal } from "./types/SerpSignal";

export const buildSerpSignalsPromptData = (signals: SerpSignal[]) => {
  return signals.slice(0, 8).map((signal) => ({
    aiAnswers: signal.aiAnswers.map((answer) => ({
      engine: answer.engine,
      text: truncateTopicText(answer.text, 1200),
    })),
    organicResults: signal.organicResults.slice(0, 8).map((result) => ({
      description: truncateTopicText(result.description, 280),
      title: result.title,
      url: result.url,
    })),
    peopleAlsoAsk: signal.peopleAlsoAsk.slice(0, 8),
    query: signal.query,
    relatedSearches: signal.relatedSearches.slice(0, 8),
  }));
};
