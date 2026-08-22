import { createGoogleCloudRunJwt } from "./createGoogleCloudRunJwt";
import { getRequiredGoogleCloudRunEnv } from "./getRequiredGoogleCloudRunEnv";

type GoogleAccessTokenResponse = {
  access_token?: unknown;
  error?: unknown;
  error_description?: unknown;
};

const tokenUrl = "https://oauth2.googleapis.com/token";

export const getGoogleCloudRunAccessToken = async () => {
  const assertion = await createGoogleCloudRunJwt({
    clientEmail: getRequiredGoogleCloudRunEnv(
      "BLOG_AI_WORKER_DISPATCH_CLIENT_EMAIL",
    ),
    privateKey: getRequiredGoogleCloudRunEnv(
      "BLOG_AI_WORKER_DISPATCH_PRIVATE_KEY",
    ),
  });
  const response = await fetch(tokenUrl, {
    body: new URLSearchParams({
      assertion,
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
    }),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST",
  });
  const body = (await response.json()) as GoogleAccessTokenResponse;

  if (!response.ok || typeof body.access_token !== "string") {
    const message =
      typeof body.error_description === "string"
        ? body.error_description
        : typeof body.error === "string"
          ? body.error
          : "Unable to authorize Cloud Run dispatch.";

    throw new Error(message);
  }

  return body.access_token;
};
