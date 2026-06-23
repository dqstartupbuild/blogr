import { assertBlogPublishConfiguration } from "./assertBlogPublishConfiguration";
import { createBlogPublishHeaders } from "./createBlogPublishHeaders";
import { getBlogPublishTimeoutMs } from "./getBlogPublishTimeoutMs";
import { readBlogPublishWebhookMessage } from "./readBlogPublishWebhookMessage";
import type { BlogPublishPayload } from "./types/BlogPublishPayload";

export const sendBlogPublishWebhook = async (payload: BlogPublishPayload) => {
  const { token, url } = assertBlogPublishConfiguration();
  const response = await fetch(url, {
    body: JSON.stringify(payload),
    headers: createBlogPublishHeaders(token),
    method: "POST",
    signal: AbortSignal.timeout(getBlogPublishTimeoutMs()),
  });

  if (!response.ok) {
    const message = await readBlogPublishWebhookMessage(response);

    throw new Error(message);
  }

  return readBlogPublishWebhookMessage(response);
};
