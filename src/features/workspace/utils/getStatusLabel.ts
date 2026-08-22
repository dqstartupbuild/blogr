import { getBlogStatusLabel } from "./getBlogStatusLabel";
import { getTopicStatusLabel } from "./getTopicStatusLabel";

export const getStatusLabel = (status: string) => {
  if (["draft", "ready", "published", "failed"].includes(status)) {
    return getBlogStatusLabel(status);
  }

  return getTopicStatusLabel(status);
};
