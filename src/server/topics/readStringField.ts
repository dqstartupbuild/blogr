import { isPlainObject } from "./isPlainObject";

export const readStringField = (
  value: unknown,
  fields: string[],
): string => {
  if (!isPlainObject(value)) {
    return "";
  }

  for (const field of fields) {
    const nextValue = value[field];

    if (typeof nextValue === "string" && nextValue.trim()) {
      return nextValue.trim();
    }
  }

  return "";
};
