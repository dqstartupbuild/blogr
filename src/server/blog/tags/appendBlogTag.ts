import { isUsableBlogTag } from "./isUsableBlogTag";
import { normalizeBlogTag } from "./normalizeBlogTag";

export const appendBlogTag = (tags: string[], value: string) => {
  const tag = normalizeBlogTag(value);

  if (isUsableBlogTag(tag) && !tags.includes(tag)) {
    tags.push(tag);
  }

  return tags;
};
