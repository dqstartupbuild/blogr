export const getImageUrlPathKey = (url?: string) => {
  if (!url) {
    return "";
  }

  try {
    const parsed = new URL(url);

    return parsed.pathname;
  } catch {
    return url.split("?")[0] || url;
  }
};