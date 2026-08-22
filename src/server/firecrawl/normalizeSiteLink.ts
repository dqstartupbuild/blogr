export const normalizeSiteLink = (link: string, baseHost: string) => {
  try {
    const url = new URL(link);
    url.hash = "";

    const hostname = url.hostname.replace(/^www\./i, "");
    if (hostname !== baseHost && !hostname.endsWith(`.${baseHost}`)) {
      return null;
    }

    if (!["http:", "https:"].includes(url.protocol)) {
      return null;
    }

    return url.toString();
  } catch {
    return null;
  }
};
