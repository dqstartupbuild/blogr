import { normalizeWhitespace } from "./normalizeWhitespace";

export const truncateTextToMaxLength = (value: string, maxLength: number) => {
  const normalized = normalizeWhitespace(value);

  if (normalized.length <= maxLength) {
    return normalized;
  }

  const sliced = normalized.slice(0, maxLength);
  const lastSpace = sliced.lastIndexOf(" ");
  const truncated = lastSpace > maxLength * 0.75 ? sliced.slice(0, lastSpace) : sliced;

  return truncated.replace(/[,\s.;:]+$/g, "").trim();
};
