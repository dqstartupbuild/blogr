export const readBlogPublishWebhookMessage = async (response: Response) => {
  const body = await response.text().catch(() => "");

  if (!body.trim()) {
    return response.statusText || "The destination did not accept the blog.";
  }

  try {
    const json = JSON.parse(body) as { error?: string; message?: string };

    return json.error || json.message || body;
  } catch {
    return body;
  }
};
