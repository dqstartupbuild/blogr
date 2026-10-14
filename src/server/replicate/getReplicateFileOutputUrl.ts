export const getReplicateFileOutputUrl = (output: unknown) => {
  if (!output || typeof output !== "object" || !("url" in output)) {
    return "";
  }

  const url = (output as { url?: unknown }).url;

  if (typeof url === "string") return url;
  if (url instanceof URL) return url.toString();

  if (typeof url === "function") {
    const value = url.call(output);

    if (typeof value === "string") return value;
    if (value instanceof URL) return value.toString();
  }

  return "";
};
