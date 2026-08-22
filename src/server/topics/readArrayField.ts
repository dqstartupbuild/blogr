import { isPlainObject } from "./isPlainObject";

export const readArrayField = (
  value: unknown,
  field: string,
): unknown[] => {
  if (!isPlainObject(value)) {
    return [];
  }

  const nextValue = value[field];

  return Array.isArray(nextValue) ? nextValue : [];
};
