export const buildYouTubeSearchUrl = (keyword: string) => {
  const query = encodeURIComponent(keyword);
  return `https://www.youtube.com/results?search_query=${query}`;
};
