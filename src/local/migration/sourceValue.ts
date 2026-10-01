import { asRecord } from "./asRecord";

export const sourceString = (record: Record<string, unknown>, key: string, fallback = "") => typeof record[key] === "string" ? record[key] as string : fallback;
export const sourceNumber = (record: Record<string, unknown>, key: string, fallback = 0) => typeof record[key] === "number" ? record[key] as number : fallback;
export const sourceArray = (record: Record<string, unknown>, key: string) => Array.isArray(record[key]) ? record[key] as unknown[] : [];
export const sourceObject = (record: Record<string, unknown>, key: string) => record[key] === undefined ? undefined : asRecord(record[key], key);
