import type { LinkItem } from "@/features/workspace/types/LinkItem";
import { scoreInternalLink } from "./scoreInternalLink";

type ChooseInternalLinksOptions = {
  keyword: string;
  links: LinkItem[];
};

export const chooseInternalLinks = ({
  keyword,
  links,
}: ChooseInternalLinksOptions) => {
  return links
    .map((link) => ({
      link,
      score: scoreInternalLink({ keyword, link }),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(({ link }) => link);
};
