export const getSignedImageUrlExpirationMs = (url: string) => {
  try {
    const parsedUrl = new URL(url);
    const signedDate = parsedUrl.searchParams.get("X-Amz-Date");
    const expiresInSeconds = Number(
      parsedUrl.searchParams.get("X-Amz-Expires"),
    );

    if (!signedDate || !Number.isFinite(expiresInSeconds)) {
      return undefined;
    }

    const match = signedDate.match(
      /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/,
    );

    if (!match) {
      return undefined;
    }

    const [, year, month, day, hour, minute, second] = match;
    const signedDateMs = Date.UTC(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hour),
      Number(minute),
      Number(second),
    );

    return signedDateMs + expiresInSeconds * 1000;
  } catch {
    return undefined;
  }
};
