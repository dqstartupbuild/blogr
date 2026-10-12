import { createBlogPublishHeaders } from "./createBlogPublishHeaders";
import { buildBlogPublishWebhookErrorMessage } from "./buildBlogPublishWebhookErrorMessage";
import { getBlogPublishTimeoutMs } from "./getBlogPublishTimeoutMs";
import { readBlogPublishWebhookMessage } from "./readBlogPublishWebhookMessage";
import type { BlogPublishPayload } from "./types/BlogPublishPayload";

type SendBlogPublishWebhookOptions = {
  token: string;
  url: string;
};

const maxWebhookPayloadBytes = 4 * 1024 * 1024;

export const sendBlogPublishWebhook = async (
  payload: BlogPublishPayload,
  destination: SendBlogPublishWebhookOptions,
) => {
  const body = JSON.stringify(payload);
  if (Buffer.byteLength(body, "utf8") > maxWebhookPayloadBytes) {
    throw new Error("This article exceeds the 4 MB publishing request limit. Reduce its images or article content, then try again.");
  }

  const response = await fetch(destination.url, {
    body,
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
