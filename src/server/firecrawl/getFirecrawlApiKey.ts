export const getFirecrawlApiKey = () => {
  const apiKey = process.env.FIRECRAWL_API_KEY;

  if (!apiKey) {
    throw new Error("Add FIRECRAWL_API_KEY first.");
  }

  return apiKey;
};
