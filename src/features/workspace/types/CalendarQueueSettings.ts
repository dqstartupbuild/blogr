export type CalendarQueueSettings =
  | { cadence: "daily" }
  | { cadence: "weekly"; weekday: number }
  | { cadence: "monthly"; dayOfMonth: number }
  | { cadence: "custom"; intervalDays: number; anchorDate: string };
