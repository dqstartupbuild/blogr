const markdownLinkPattern = /\[[^\]]*]\((https?:\/\/[^)\s]+)(?:\s+"[^"]*")?\)/gi;

export const extractMarkdownLinkUrls = (markdown: string) => {
  return Array.from(markdown.matchAll(markdownLinkPattern))
    .map((match) => match[1])
    .filter((url): url is string => Boolean(url));
};
