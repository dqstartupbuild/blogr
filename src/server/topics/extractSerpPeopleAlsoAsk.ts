import type { GoogleSearchScraperRecord } from "../apify/types/GoogleSearchScraperRecord";
import { dedupeTopicStrings } from "./dedupeTopicStrings";
import { readArrayField } from "./readArrayField";
import { readStringField } from "./readStringField";

export const extractSerpPeopleAlsoAsk = (
  record: GoogleSearchScraperRecord,
) => {
  return dedupeTopicStrings(
    readArrayField(record, "peopleAlsoAsk").map((item) =>
      readStringField(item, ["question", "title", "text"]),
    ),
  ).slice(0, 12);
};
