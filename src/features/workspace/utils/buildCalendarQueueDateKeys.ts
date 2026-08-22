import type { CalendarQueueSettings } from "../types/CalendarQueueSettings";
import { getLocalDateKey } from "./getLocalDateKey";
import { isValidLocalDateKey } from "./isValidLocalDateKey";
import { parseLocalDateKey } from "./parseLocalDateKey";

type Input = { candidateDateKeys: string[]; settings: CalendarQueueSettings; stableSeed: string };
const dayOrdinal = (date: Date) => Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000);
const addDays = (date: Date, days: number) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
const hash = (value: string) => { let h = 2166136261; for (let i = 0; i < value.length; i += 1) { h ^= value.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
const jitter = (seed: string, span: number) => span === 0 ? 0 : (hash(seed) % (span * 2 + 1)) - span;
const sortedCandidates = (keys: string[]) => Array.from(new Set(keys.filter(isValidLocalDateKey))).sort();

export const buildCalendarQueueDateKeys = ({ candidateDateKeys, settings, stableSeed }: Input) => {
  const candidates = sortedCandidates(candidateDateKeys);
  if (!candidates.length) return [];
  if (settings.cadence === "daily") return candidates;
  if (settings.cadence === "weekly") return candidates.filter((key) => parseLocalDateKey(key).getDay() === settings.weekday);
  const candidateSet = new Set(candidates);
  const result = new Set<string>();
  const first = parseLocalDateKey(candidates[0]); const last = parseLocalDateKey(candidates[candidates.length - 1]);
  if (settings.cadence === "monthly") {
    for (let month = new Date(first.getFullYear(), first.getMonth(), 1); month <= last; month = new Date(month.getFullYear(), month.getMonth() + 1, 1)) {
      const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
      const nominal = new Date(month.getFullYear(), month.getMonth(), Math.min(settings.dayOfMonth, days));
      const minOffset = -Math.min(3, nominal.getDate() - 1); const maxOffset = Math.min(3, days - nominal.getDate());
      const offset = minOffset + (hash(`${stableSeed}:monthly:${settings.dayOfMonth}:${getLocalDateKey(nominal)}`) % (maxOffset - minOffset + 1));
      const key = getLocalDateKey(addDays(nominal, offset)); if (candidateSet.has(key)) result.add(key);
    }
  } else {
    const span = Math.min(3, Math.floor((settings.intervalDays - 1) / 2));
    const anchor = parseLocalDateKey(settings.anchorDate); const start = dayOrdinal(first) - span; const end = dayOrdinal(last) + span; const anchorOrdinal = dayOrdinal(anchor);
    for (let n = Math.floor((start - anchorOrdinal) / settings.intervalDays); anchorOrdinal + n * settings.intervalDays <= end; n += 1) {
      if (n < 0) continue;
      const nominal = addDays(anchor, n * settings.intervalDays); let offset = jitter(`${stableSeed}:custom:${settings.intervalDays}:${settings.anchorDate}:${getLocalDateKey(nominal)}`, span); if (n === 0) offset = Math.max(0, offset);
      const key = getLocalDateKey(addDays(nominal, offset)); if (candidateSet.has(key)) result.add(key);
    }
  }
  return Array.from(result).sort();
};
