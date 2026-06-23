import type { GoogleSearchScraperRecord } from "../apify/types/GoogleSearchScraperRecord";
import { dedupeSerpOrganicResults } from "./dedupeSerpOrganicResults";
import { mapSerpOrganicResult } from "./mapSerpOrganicResult";
import { readArrayField } from "./readArrayField";

export const extractSerpOrganicResults = (
  record: GoogleSearchScraperRecord,
) => {
  const nestedResults = readArrayField(record, "organicResults")
    .map(mapSerpOrganicResult)
    .filter((item) => item !== null);
  const topLevelResult =
    record.type === "organic" ? mapSerpOrganicResult(record) : null;

  return dedupeSerpOrganicResults(
    topLevelResult ? [topLevelResult, ...nestedResults] : nestedResults,
  ).slice(0, 10);
};
