export const fetchXml = async (url: string) => {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;

    const text = await response.text();
    if (!text.toLowerCase().includes("<loc>")) return null;

    return text;
  } catch {
    return null;
  }
};
