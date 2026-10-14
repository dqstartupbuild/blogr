export const getTopicStatusLabel = (status: string) => {
  if (status === "saved") {
    return "Saved";
  }

  if (status === "scheduled") {
    return "Scheduled";
  }

  if (status === "writing") {
    return "Writing";
  }

  if (status === "written") {
    return "Article ready";
  }

  if (status === "published") {
    return "Published";
  }

  return "Needs attention";
};
