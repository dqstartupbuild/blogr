const markdownImagePattern = /!\[[^\]]*]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;

export const getMarkdownImageUrls = (mdx: string) => {
  return Array.from(mdx.matchAll(markdownImagePattern))
    .map((match) => match[1])
    .filter((url): url is string => Boolean(url));
};