import type { LinkItem } from "./LinkItem";

export type ProductLinksRefreshResponse = {
  error?: string;
  siteLinks?: LinkItem[];
};
