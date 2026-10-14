import type { ExaSearchResponse } from "./types/ExaSearchResponse";

type FetchExaSearchOptions = {
  apiKey: string;
  includeDomains?: string[];
  numResults?: number;
  query: string;
};

export const fetchExaSearch = async ({
  apiKey,
  includeDomains,
  numResults = 5,
  query,
}: FetchExaSearchOptions) => {
  const response = await fetch("https://api.exa.ai/search", {
    body: JSON.stringify({
      includeDomains,
      numResults,
      query,
      type: "auto",
    }),
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
    method: "POST",
  });
  const data = (await response.json()) as ExaSearchResponse;

  if (!response.ok) {
    return [];
  }

  return data.results || [];
};
