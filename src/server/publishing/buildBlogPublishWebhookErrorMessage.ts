type BlogPublishWebhookErrorMessageOptions = {
  message: string;
  status: number;
  statusText: string;
};

export const buildBlogPublishWebhookErrorMessage = ({
  message,
  status,
  statusText,
}: BlogPublishWebhookErrorMessageOptions) => {
  const responseLabel = [status, statusText].filter(Boolean).join(" ");
  const responseMessage = message.trim() || responseLabel;

  if (status === 405) {
    return [
      "The publishing link is not accepting blog posts.",
      "Open Settings and make sure the Webhook URL points to the receiving app's POST endpoint.",
      responseMessage ? `Destination response: ${responseMessage}` : "",
    ]
      .filter(Boolean)
      .join(" ");
  }

  return [
    `The publishing destination did not accept the blog${responseLabel ? ` (${responseLabel})` : ""}.`,
    responseMessage ? `Destination response: ${responseMessage}` : "",
  ]
    .filter(Boolean)
    .join(" ");
};
