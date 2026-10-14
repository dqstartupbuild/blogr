export const extractYoutubeVideoId = (url: string) => {
  try {
    const parsedUrl = new URL(url);
    const host = parsedUrl.hostname.replace(/^www\./i, "");

    if (
      host === "youtube.com" ||
      host === "m.youtube.com" ||
      host === "music.youtube.com" ||
      host === "youtube-nocookie.com"
    ) {
      const videoId = parsedUrl.searchParams.get("v");
      if (videoId) return videoId;

      const [, pathVideoId] =
        parsedUrl.pathname.match(/^\/(?:shorts|embed|live)\/([^/?#]+)/) || [];

      return pathVideoId || "";
    }

    if (host === "youtu.be") {
      return parsedUrl.pathname.replace(/^\/+/, "").split("/")[0] || "";
    }

    return "";
  } catch {
    return "";
  }
};
