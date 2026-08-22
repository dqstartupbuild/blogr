export type ScheduleTopicOnCalendar = (
  topicId: string,
  scheduledDate: string,
) => Promise<void> | void;
