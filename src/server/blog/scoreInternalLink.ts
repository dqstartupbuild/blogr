import type { LinkItem } from "@/features/workspace/types/LinkItem";
import { tokenize } from "./tokenize";

type ScoreInternalLinkOptions = {
  keyword: string;
  link: LinkItem;
};

export const scoreInternalLink = ({
  keyword,
  link,
}: ScoreInternalLinkOptions) => {
  const keywordTokens = new Set(tokenize(keyword));
  const linkTokens = tokenize(`${link.title} ${link.url} ${link.reason || ""}`);

  return linkTokens.reduce(
    (score, token) => score + (keywordTokens.has(token) ? 3 : 1),
    0,
  );
};
