export const getBlogPublishUrl = () => {
  return process.env.BLOG_PUBLISH_WEBHOOK_URL?.trim() || "";
};
