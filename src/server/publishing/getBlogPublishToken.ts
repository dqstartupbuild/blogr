export const getBlogPublishToken = () => {
  return process.env.BLOG_PUBLISH_WEBHOOK_TOKEN?.trim() || "";
};
