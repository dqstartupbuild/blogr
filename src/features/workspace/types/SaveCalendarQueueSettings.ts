import type { CalendarQueueSettings } from "./CalendarQueueSettings";
export type SaveCalendarQueueSettings = (settings: CalendarQueueSettings, expectedUpdatedAt: number) => Promise<void> | void;
