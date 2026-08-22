import { createBlogPublishHeaders } from "./createBlogPublishHeaders";
import { buildBlogPublishWebhookErrorMessage } from "./buildBlogPublishWebhookErrorMessage";
import { getBlogPublishTimeoutMs } from "./getBlogPublishTimeoutMs";
import { readBlogPublishWebhookMessage } from "./readBlogPublishWebhookMessage";
import type { BlogPublishPayload } from "./types/BlogPublishPayload";

type SendBlogPublishWebhookOptions = {
  token: string;
  url: string;
};

export const sendBlogPublishWebhook = async (
  payload: BlogPublishPayload,
  destination: SendBlogPublishWebhookOptions,
) => {
  const response = await fetch(destination.url, {
    body: JSON.stringify(payload),
    headers: createBlogPublishHeaders(destination.token),
    method: "POST",
    signal: AbortSignal.timeout(getBlogPublishTimeoutMs()),
  });

  if (!response.ok) {
    const message = await readBlogPublishWebhookMessage(response);

    throw new Error(
      buildBlogPublishWebhookErrorMessage({
        message,
        status: response.status,
        statusText: response.statusText,
      }),
    );
  }

  return readBlogPublishWebhookMessage(response);
};
