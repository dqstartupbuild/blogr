import { maxBlogTagLength } from "./constants/blogTagLimits";
import { removeBlogTagLeadIn } from "./removeBlogTagLeadIn";

export const normalizeBlogTag = (value: string) => {
  return removeBlogTagLeadIn(value)
    .replace(/&/g, " and ")
    .replace(/[^a-zA-Z0-9+#/ ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase()
    .replace(/^(a simple guide to|guide to|how to|what is|what are)\s+/i, "")
    .replace(/^(why|best|the|a|an)\s+/i, "")
    .slice(0, maxBlogTagLength)
    .trim();
};
