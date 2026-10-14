import { getReplicateFileOutputUrl } from "./getReplicateFileOutputUrl";

export const normalizeReplicateImageUrl = (output: unknown) => {
  if (typeof output === "string") return output;

  if (Array.isArray(output)) {
    const first = output[0];
    if (typeof first === "string") return first;
    if (first instanceof URL) return first.toString();

    const fileUrl = getReplicateFileOutputUrl(first);
    if (fileUrl) return fileUrl;
  }

  if (output instanceof URL) return output.toString();

  const fileUrl = getReplicateFileOutputUrl(output);
  if (fileUrl) return fileUrl;

  return "";
};
