import { isPlainObject } from "./isPlainObject";
import { readStringField } from "./readStringField";
import type { SerpOrganicResult } from "./types/SerpOrganicResult";

export const mapSerpOrganicResult = (
  value: unknown,
): SerpOrganicResult | null => {
  if (!isPlainObject(value)) {
    return null;
  }

  const title = readStringField(value, ["title"]);
  const url = readStringField(value, ["url", "link"]);

  if (!title && !url) {
    return null;
  }

  const positionValue = value.position;

  return {
    description: readStringField(value, ["description", "snippet", "text"]),
    displayedUrl: readStringField(value, ["displayedUrl", "displayUrl"]),
    position: typeof positionValue === "number" ? positionValue : undefined,
    title,
    url,
  };
};
