import { auth } from "@clerk/nextjs/server";
import { AuthError } from "./AuthError";
import { isAuthDisabledForPreview } from "./isAuthDisabledForPreview";

export const requireRouteUserId = async () => {
  if (isAuthDisabledForPreview()) {
    return "preview-user";
  }

  const authState = await auth();

  if (!authState.userId) {
    throw new AuthError();
  }

  return authState.userId;
};
