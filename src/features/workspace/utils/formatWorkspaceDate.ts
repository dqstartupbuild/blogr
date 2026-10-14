export const formatWorkspaceDate = (timestamp: number) => {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(timestamp));
};
