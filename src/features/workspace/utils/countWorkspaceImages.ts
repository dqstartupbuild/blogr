import { countBlogImages } from "./countBlogImages";
import type { BlogItem } from "../types/BlogItem";

export const countWorkspaceImages = (blogs: BlogItem[]) => {
  return blogs.reduce((total, blog) => total + countBlogImages(blog), 0);
};
