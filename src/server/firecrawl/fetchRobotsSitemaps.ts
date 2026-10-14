export const fetchRobotsSitemaps = async (origin: string) => {
  try {
    const response = await fetch(`${origin}/robots.txt`);
    if (!response.ok) return [];

    const text = await response.text();
    const matches = text.matchAll(/^sitemap:\s*(.+)$/gim);

    return Array.from(matches)
      .map((match) => match[1]?.trim())
      .filter((value): value is string => Boolean(value));
  } catch {
    return [];
  }
};
