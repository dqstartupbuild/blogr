export type CalendarQueueSettingsDraft = {
  cadence: "daily" | "weekly" | "monthly" | "custom";
  customIntervalDays: string;
  monthlyDayOfMonth: string;
  weeklyWeekday: string;
};
