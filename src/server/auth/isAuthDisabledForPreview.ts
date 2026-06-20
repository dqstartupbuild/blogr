export const isAuthDisabledForPreview = () => {
  return process.env.AUTH_DISABLED_FOR_PREVIEW === "true";
};
