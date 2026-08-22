type BlogStatus = "draft" | "ready" | "failed" | "published";

type TopicStatus =
  | "saved"
  | "scheduled"
  | "writing"
  | "written"
  | "published"
  | "failed";

export const resolveTopicStatusFromBlog = (
  blogStatus: BlogStatus,
  topicStatus: TopicStatus,
): TopicStatus => {
  if (blogStatus === "published") {
    return "published";
  }

  if (topicStatus === "writing") {
    return "writing";
  }

  return "written";
};
