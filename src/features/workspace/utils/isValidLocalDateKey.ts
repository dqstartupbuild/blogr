import { getLocalDateKey } from "./getLocalDateKey";
import { parseLocalDateKey } from "./parseLocalDateKey";

export const isValidLocalDateKey = (value: unknown): value is string =>
  typeof value === "string" &&
  /^\d{4}-\d{2}-\d{2}$/.test(value) &&
  getLocalDateKey(parseLocalDateKey(value)) === value;
