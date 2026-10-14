import { normalizeHexColor } from "./normalizeHexColor";

export const mergeUniqueColors = (...lists: string[][]) => {
  const merged: string[] = [];
  const seen = new Set<string>();

  lists.forEach((list) => {
    list.forEach((color) => {
      const normalized = normalizeHexColor(color);
      if (!normalized || seen.has(normalized)) return;

      seen.add(normalized);
      merged.push(normalized);
    });
  });

  return merged.slice(0, 12);
};
