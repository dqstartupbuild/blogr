import type { QuickFillAssignment } from "../types/QuickFillAssignment";
import type { TopicItem } from "../types/TopicItem";
import { canAddTopicToCalendar } from "./canAddTopicToCalendar";

export const buildQuickFillAssignments = (
  topics: TopicItem[],
  candidateDateKeys: string[],
): QuickFillAssignment[] => {
  const occupiedDates = new Set(
    topics
      .map((topic) => topic.scheduledDate)
      .filter((date): date is string => Boolean(date)),
  );
  const openDates = Array.from(new Set(candidateDateKeys))
    .filter((date) => !occupiedDates.has(date))
    .sort()
    .slice(0, 30);
  const eligibleTopics = topics
    .filter(
      (topic) => !topic.scheduledDate && canAddTopicToCalendar(topic),
    )
    .sort(
      (left, right) =>
        (left.createdAt || 0) - (right.createdAt || 0) ||
        left.id.localeCompare(right.id),
    )
    .slice(0, 30);

  return openDates
    .slice(0, eligibleTopics.length)
    .map((scheduledDate, index) => ({
      scheduledDate,
      topicId: eligibleTopics[index].id,
    }));
};
