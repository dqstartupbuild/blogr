export const getBlogPublishSource = (sourceName?: string) => {
  return (
    sourceName?.trim() ||
    process.env.BLOG_PUBLISH_SOURCE_NAME?.trim() ||
    "Blogr"
  );
};
