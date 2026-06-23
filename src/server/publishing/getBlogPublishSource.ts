export const getBlogPublishSource = () => {
  return process.env.BLOG_PUBLISH_SOURCE_NAME?.trim() || "Blogger";
};
