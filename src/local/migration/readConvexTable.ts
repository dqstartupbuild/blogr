import { asRecord } from "./asRecord";
import type { ConvexRecord } from "./ConvexRecord";

export const readConvexTable = (text: string, table: string): ConvexRecord[] => text.split(/\r?\n/).filter(Boolean).map((line, index) => {
  const record = asRecord(JSON.parse(line), `${table} row ${index + 1}`);
  if (typeof record._id !== "string" || typeof record.userId !== "string") throw new Error(`${table} row ${index + 1} lacks _id or userId.`);
  return record as ConvexRecord;
});
