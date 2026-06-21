export const extractYoutubeVideoId = (url: string) => {
  try {
    const parsedUrl = new URL(url);
    const host = parsedUrl.hostname.replace(/^www\./i, "");

    if (host === "youtube.com" || host === "m.youtube.com") {
      const videoId = parsedUrl.searchParams.get("v");
      return videoId || "";
    }

    if (host === "youtu.be") {
      return parsedUrl.pathname.replace(/^\/+/, "").split("/")[0] || "";
    }

    return "";
  } catch {
    return "";
  }
};
