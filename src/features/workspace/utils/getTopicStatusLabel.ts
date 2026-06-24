export const getTopicStatusLabel = (status: string) => {
  if (status === "saved") {
    return "Saved";
  }

  if (status === "writing") {
    return "Writing";
  }

  if (status === "written") {
    return "Article ready";
  }

  return "Needs attention";
};
