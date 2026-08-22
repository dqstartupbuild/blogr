import { normalizeHexColor } from "./normalizeHexColor";

export const extractHtmlColorCandidates = (
  ...htmlParts: Array<string | undefined>
) => {
  const source = htmlParts
    .filter((part): part is string => Boolean(part?.trim()))
    .join("\n");

  if (!source) return [];

  const counts = new Map<string, number>();
  const matches = source.matchAll(
    /#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/g,
  );

  for (const match of matches) {
    const normalized = normalizeHexColor(match[0]);
    if (!normalized) continue;

    counts.set(normalized, (counts.get(normalized) || 0) + 1);
  }

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 16)
    .map(([color]) => color);
};
