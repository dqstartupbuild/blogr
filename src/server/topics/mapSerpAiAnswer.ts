import { readStringField } from "./readStringField";
import type { SerpAiAnswer } from "./types/SerpAiAnswer";

export const mapSerpAiAnswer = (
  value: unknown,
  fallbackEngine: string,
): SerpAiAnswer | null => {
  if (typeof value === "string" && value.trim()) {
    return {
      engine: fallbackEngine,
      text: value.trim(),
    };
  }

  const text = readStringField(value, ["text", "answer", "summary"]);

  if (!text) {
    return null;
  }

  return {
    engine: readStringField(value, ["engine", "provider"]) || fallbackEngine,
    text,
  };
};
