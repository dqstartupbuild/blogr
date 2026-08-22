export const getBlogStatusLabel = (status: string) => {
  if (status === "ready") {
    return "Ready";
  }

  if (status === "published") {
    return "Published";
  }

  if (status === "failed") {
    return "Needs attention";
  }

  return "Draft";
};
