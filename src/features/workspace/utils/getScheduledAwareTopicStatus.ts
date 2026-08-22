import type { TopicItem } from "../types/TopicItem";

type GetScheduledAwareTopicStatusOptions = {
  scheduledDate?: string;
  status?: TopicItem["status"];
};

export const getScheduledAwareTopicStatus = ({
  scheduledDate,
  status = "saved",
}: GetScheduledAwareTopicStatusOptions): TopicItem["status"] => {
  if (status === "saved" && scheduledDate) {
    return "scheduled";
  }

  return status;
};
