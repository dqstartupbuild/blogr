import type { ProductProfileDraft } from "./types/ProductProfileDraft";

export const parseProductProfileJson = (text: string): ProductProfileDraft => {
  const trimmed = text.trim();
  const jsonStart = trimmed.indexOf("{");
  const jsonEnd = trimmed.lastIndexOf("}");

  if (jsonStart === -1 || jsonEnd === -1) {
    return {};
  }

  return JSON.parse(trimmed.slice(jsonStart, jsonEnd + 1)) as ProductProfileDraft;
};
