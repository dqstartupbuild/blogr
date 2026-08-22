import {
  maxBlogTagLength,
  minBlogTagLength,
} from "./constants/blogTagLimits";

export const isUsableBlogTag = (tag: string) => {
  return (
    tag.length >= minBlogTagLength &&
    tag.length <= maxBlogTagLength &&
    !tag.includes("cover this gap") &&
    tag !== "keyword" &&
    tag !== "tag"
  );
};
