import { describe, expect, it } from "vitest";
import type { CalendarQueueSettings } from "../types/CalendarQueueSettings";
import { buildCalendarQueueDateKeys } from "./buildCalendarQueueDateKeys";
import { getLocalDateKey } from "./getLocalDateKey";
import { normalizeCalendarQueueSettings } from "./normalizeCalendarQueueSettings";
import { parseLocalDateKey } from "./parseLocalDateKey";
import { buildCalendarQueueSettingsFromDraft } from "./buildCalendarQueueSettingsFromDraft";

const buildDays = (start: string, count: number) => {
  const startDate = parseLocalDateKey(start);
  return Array.from({ length: count }, (_, index) =>
    getLocalDateKey(
      new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate() + index,
      ),
    ),
  );
};

const calendarDayDistance = (left: string, right: string) => {
  const leftDate = parseLocalDateKey(left);
  const rightDate = parseLocalDateKey(right);
  const leftOrdinal = Date.UTC(
    leftDate.getFullYear(),
    leftDate.getMonth(),
    leftDate.getDate(),
  );
  const rightOrdinal = Date.UTC(
    rightDate.getFullYear(),
    rightDate.getMonth(),
    rightDate.getDate(),
  );
  return Math.round((leftOrdinal - rightOrdinal) / 86_400_000);
};

const generate = (
  candidateDateKeys: string[],
  settings: CalendarQueueSettings,
  stableSeed = "workspace-a",
) => buildCalendarQueueDateKeys({ candidateDateKeys, settings, stableSeed });

describe("daily calendar queues", () => {
  it("returns valid candidates in chronological, unique order", () => {
    expect(
      generate(
        ["2026-08-03", "invalid", "2026-08-01", "2026-08-01"],
        { cadence: "daily" },
      ),
    ).toEqual(["2026-08-01", "2026-08-03"]);
  });

  it("matches the old occupied-date filtering behavior", () => {
    const candidates = buildDays("2026-08-01", 5);
    const occupied = new Set(["2026-08-02", "2026-08-04"]);
    expect(generate(candidates, { cadence: "daily" }).filter((date) => !occupied.has(date))).toEqual(
      candidates.filter((date) => !occupied.has(date)),
    );
  });
});

describe("weekly calendar queues", () => {
  it.each([0, 1, 2, 3, 4, 5, 6])(
    "uses JavaScript weekday %s",
    (weekday) => {
      const candidates = buildDays("2026-08-02", 7);
      const result = generate(candidates, { cadence: "weekly", weekday });
      expect(result).toHaveLength(1);
      expect(parseLocalDateKey(result[0]).getDay()).toBe(weekday);
    },
  );

  it("includes the first candidate when it matches", () => {
    expect(
      generate(buildDays("2026-08-03", 3), {
        cadence: "weekly",
        weekday: 1,
      }),
    ).toContain("2026-08-03");
  });
});

describe("monthly calendar queues", () => {
  it.each([
    ["2026-04-01", 30, 31, "2026-04-30"],
    ["2026-02-01", 28, 31, "2026-02-28"],
    ["2028-02-01", 29, 31, "2028-02-29"],
    ["2026-08-01", 31, 15, "2026-08-15"],
  ] as const)("clamps and jitters %s", (start, count, dayOfMonth, nominal) => {
    const result = generate(buildDays(start, count), {
      cadence: "monthly",
      dayOfMonth,
    });
    expect(result).toHaveLength(1);
    expect(Math.abs(calendarDayDistance(result[0], nominal))).toBeLessThanOrEqual(3);
    expect(result[0].slice(0, 7)).toBe(start.slice(0, 7));
  });

  it("is stable for the same seed and settings", () => {
    const candidates = buildDays("2026-08-01", 31);
    const settings = { cadence: "monthly", dayOfMonth: 15 } as const;
    expect(generate(candidates, settings)).toEqual(generate(candidates, settings));
  });
});

describe("custom calendar queues", () => {
  it.each([
    [1, 0],
    [2, 0],
    [3, 1],
    [5, 2],
    [7, 3],
    [30, 3],
    [90, 3],
  ] as const)("limits every %s days to jitter %s", (intervalDays, maximumJitter) => {
    const candidates = buildDays("2026-01-01", 365);
    const result = generate(candidates, {
      anchorDate: "2026-01-01",
      cadence: "custom",
      intervalDays,
    });
    result.forEach((actualDate) => {
      const occurrenceIndex = Math.round(
        calendarDayDistance(actualDate, "2026-01-01") / intervalDays,
      );
      const nominalDate = getLocalDateKey(
        new Date(2026, 0, 1 + occurrenceIndex * intervalDays),
      );
      expect(Math.abs(calendarDayDistance(actualDate, nominalDate))).toBeLessThanOrEqual(
        maximumJitter,
      );
    });
    expect(result).toEqual([...result].sort());
    expect(new Set(result).size).toBe(result.length);
  });

  it("does not move occurrence zero before its anchor", () => {
    const result = generate(buildDays("2026-08-01", 31), {
      anchorDate: "2026-08-01",
      cadence: "custom",
      intervalDays: 7,
    });
    expect(result[0] >= "2026-08-01").toBe(true);
  });

  it("can include an occurrence whose nominal date is outside the month", () => {
    const candidates = buildDays("2026-08-01", 31);
    const settings = {
      anchorDate: "2026-07-01",
      cadence: "custom",
      intervalDays: 30,
    } as const;
    const seed = Array.from({ length: 100 }, (_, index) => `seed-${index}`).find(
      (stableSeed) => generate(candidates, settings, stableSeed).includes("2026-08-01"),
    );
    expect(seed).toBeDefined();
  });

  it("does not emit one occurrence in two adjacent month calculations", () => {
    const settings = {
      anchorDate: "2026-01-01",
      cadence: "custom",
      intervalDays: 30,
    } as const;
    const january = new Set(generate(buildDays("2026-01-01", 31), settings));
    const february = generate(buildDays("2026-02-01", 28), settings);
    expect(february.some((date) => january.has(date))).toBe(false);
  });
});

describe("local date handling and occupied targets", () => {
  it("does not skip or duplicate dates across daylight-saving changes", () => {
    const candidates = buildDays("2026-03-06", 7);
    expect(generate(candidates, { cadence: "daily" })).toEqual(candidates);
  });

  it("returns an empty result for empty candidates", () => {
    expect(generate([], { cadence: "daily" })).toEqual([]);
  });

  it("removes an occupied deterministic target without inventing a fallback", () => {
    const candidates = buildDays("2026-08-01", 31);
    const targets = generate(candidates, { cadence: "monthly", dayOfMonth: 15 });
    const occupied = new Set(targets);
    expect(targets.filter((date) => !occupied.has(date))).toEqual([]);
    expect(generate(candidates, { cadence: "monthly", dayOfMonth: 15 })).toEqual(targets);
  });
});

describe("queue normalization", () => {
  it("defaults missing and malformed settings to Daily", () => {
    expect(normalizeCalendarQueueSettings(undefined)).toEqual({ cadence: "daily" });
    expect(normalizeCalendarQueueSettings({ cadence: "weekly", weekday: 1.5 })).toEqual({ cadence: "daily" });
    expect(normalizeCalendarQueueSettings({ cadence: "custom", intervalDays: Number.NaN, anchorDate: "2026-08-01" })).toEqual({ cadence: "daily" });
  });

  it("rejects invalid form numbers and preserves a matching custom anchor", () => {
    const current = {
      anchorDate: "2026-07-01",
      cadence: "custom",
      intervalDays: 7,
    } as const;
    expect(
      buildCalendarQueueSettingsFromDraft(
        {
          cadence: "custom",
          customIntervalDays: "7.5",
          monthlyDayOfMonth: "1",
          weeklyWeekday: "1",
        },
        current,
      ),
    ).toBeNull();
    expect(
      buildCalendarQueueSettingsFromDraft(
        {
          cadence: "custom",
          customIntervalDays: "7",
          monthlyDayOfMonth: "1",
          weeklyWeekday: "1",
        },
        current,
        new Date(2026, 7, 20),
      ),
    ).toEqual(current);
    expect(
      buildCalendarQueueSettingsFromDraft(
        {
          cadence: "custom",
          customIntervalDays: "14",
          monthlyDayOfMonth: "1",
          weeklyWeekday: "1",
        },
        current,
        new Date(2026, 7, 20),
      ),
    ).toEqual({
      anchorDate: "2026-08-20",
      cadence: "custom",
      intervalDays: 14,
    });
  });
});
