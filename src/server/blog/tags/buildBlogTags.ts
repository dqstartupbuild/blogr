import { appendBlogTag } from "./appendBlogTag";
import { maxBlogTagCount } from "./constants/blogTagLimits";
import { getBlogTagConnectorPhrases } from "./getBlogTagConnectorPhrases";
import { getBlogTagWordPhrases } from "./getBlogTagWordPhrases";
import { normalizeBlogTag } from "./normalizeBlogTag";
import { splitBlogTagText } from "./splitBlogTagText";

type BuildBlogTagsOptions = {
  excerpt?: string;
  keyword: string;
  seoTitle?: string;
  title?: string;
  topicBrief?: string;
};

export const buildBlogTags = ({
  excerpt,
  keyword,
  seoTitle,
  title,
  topicBrief,
}: BuildBlogTagsOptions) => {
  const tags: string[] = [];
  const sources = [keyword, title || "", seoTitle || "", excerpt || ""];

  for (const source of sources) {
    for (const phrase of splitBlogTagText(source)) {
      appendBlogTag(tags, phrase);
    }
  }

  for (const phrase of getBlogTagConnectorPhrases(normalizeBlogTag(keyword))) {
    appendBlogTag(tags, phrase);
  }

  for (const phrase of getBlogTagWordPhrases(normalizeBlogTag(keyword))) {
    appendBlogTag(tags, phrase);
  }

  if (topicBrief?.toLowerCase().includes("search gap:")) {
    appendBlogTag(tags, "content gap");
  }

  return tags.slice(0, maxBlogTagCount);
};
