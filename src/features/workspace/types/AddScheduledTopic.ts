export type AddScheduledTopic = (
  keyword: string,
  scheduledDate: string,
  notes?: string,
) => Promise<void> | void;
