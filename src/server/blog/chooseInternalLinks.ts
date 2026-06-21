import type { LinkItem } from "@/features/workspace/types/LinkItem";
import type { InternalLinksPerArticle } from "@/features/workspace/types/InternalLinksPerArticle";
import { scoreInternalLink } from "./scoreInternalLink";

type ChooseInternalLinksOptions = {
  keyword: string;
  links: LinkItem[];
  limit: InternalLinksPerArticle;
};

export const chooseInternalLinks = ({
  keyword,
  links,
  limit,
}: ChooseInternalLinksOptions) => {
  if (limit === 0) {
    return [];
  }

  return links
    .map((link) => ({
      link,
      score: scoreInternalLink({ keyword, link }),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ link }) => link);
};
