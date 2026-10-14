import type { LinkItem } from "../types/LinkItem";

export const buildInitialProductLink = (websiteUrl: string): LinkItem => {
  const host = new URL(websiteUrl).hostname.replace(/^www\./i, "");

  return {
    title: host,
    url: websiteUrl,
  };
};
