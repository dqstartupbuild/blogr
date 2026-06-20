export const normalizeReplicateImageUrl = (output: unknown) => {
  if (typeof output === "string") return output;

  if (Array.isArray(output)) {
    const first = output[0];
    if (typeof first === "string") return first;
    if (first instanceof URL) return first.toString();
  }

  if (output instanceof URL) return output.toString();

  if (output && typeof output === "object" && "url" in output) {
    const url = (output as { url?: unknown }).url;
    if (typeof url === "string") return url;
  }

  return "";
};
