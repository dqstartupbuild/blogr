import { auth } from "@clerk/nextjs/server";
import { isAuthDisabledForPreview } from "./isAuthDisabledForPreview";

export const getConvexAuthToken = async () => {
  if (isAuthDisabledForPreview()) {
    return undefined;
  }

  const authState = await auth();
  return (await authState.getToken({ template: "convex" })) ?? undefined;
};
