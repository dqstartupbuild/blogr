export const formatCountLabel = (count: number, singular: string) => {
  return `${count.toLocaleString()} ${singular}${count === 1 ? "" : "s"}`;
};
