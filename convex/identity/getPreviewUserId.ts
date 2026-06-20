export const getPreviewUserId = () => {
  if (process.env.AUTH_DISABLED_FOR_PREVIEW === "true") {
    return "preview-user";
  }

  return null;
};
