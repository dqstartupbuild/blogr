import type { GoogleSearchScraperRecord } from "../apify/types/GoogleSearchScraperRecord";
import { dedupeTopicStrings } from "./dedupeTopicStrings";
import { readArrayField } from "./readArrayField";
import { readStringField } from "./readStringField";

export const extractSerpRelatedSearches = (
  record: GoogleSearchScraperRecord,
) => {
  const relatedItems = [
    ...readArrayField(record, "relatedQueries"),
    ...readArrayField(record, "relatedSearches"),
  ];

  return dedupeTopicStrings(
    relatedItems.map((item) =>
      readStringField(item, ["title", "query", "text"]),
    ),
  ).slice(0, 12);
};
