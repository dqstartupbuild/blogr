import { v } from "convex/values";

export const calendarQueueSettingsValidator = v.union(
  v.object({ cadence: v.literal("daily") }),
  v.object({ cadence: v.literal("weekly"), weekday: v.number() }),
  v.object({ cadence: v.literal("monthly"), dayOfMonth: v.number() }),
  v.object({ cadence: v.literal("custom"), intervalDays: v.number(), anchorDate: v.string() }),
);
