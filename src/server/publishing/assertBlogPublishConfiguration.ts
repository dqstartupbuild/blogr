import { getBlogPublishToken } from "./getBlogPublishToken";
import { getBlogPublishUrl } from "./getBlogPublishUrl";

export const assertBlogPublishConfiguration = () => {
  const url = getBlogPublishUrl();
  const token = getBlogPublishToken();

  if (!url || !token) {
    throw new Error(
      "Add BLOG_PUBLISH_WEBHOOK_URL and BLOG_PUBLISH_WEBHOOK_TOKEN before publishing.",
    );
  }

  return { token, url };
};
