import type { GoogleSearchScraperRecord } from "../apify/types/GoogleSearchScraperRecord";
import { readStringField } from "./readStringField";

export const extractSerpQuery = (record: GoogleSearchScraperRecord) => {
  const nestedQuery = record.searchQuery;
  const nestedTerm = readStringField(nestedQuery, ["term", "query"]);

  return (
    nestedTerm ||
    readStringField(record, ["query", "term", "searchTerm", "keyword"])
  );
};
