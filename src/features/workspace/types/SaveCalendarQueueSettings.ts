import type { CalendarQueueSettings } from "./CalendarQueueSettings";
export type SaveCalendarQueueSettings = (settings: CalendarQueueSettings) => Promise<void> | void;
