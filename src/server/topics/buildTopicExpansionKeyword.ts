import type { TopicExpansionPattern } from "./types/TopicExpansionPattern";

type BuildTopicExpansionKeywordOptions = {
  base: string;
  pattern: TopicExpansionPattern;
  scope: string;
};

export const buildTopicExpansionKeyword = ({
  base,
  pattern,
  scope,
}: BuildTopicExpansionKeywordOptions) => {
  return pattern.template
    .split("{base}")
    .join(base)
    .split("{scope}")
    .join(scope)
    .replace(/\s+/g, " ")
    .trim();
};
