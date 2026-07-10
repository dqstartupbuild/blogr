const defaultTopicBriefFailureMessage =
  "We couldn't find a brief right now. Please try again.";

export const getTopicBriefFailureMessage = (error: unknown) => {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : "";

  if (/no search brief was found/i.test(message)) {
    return "No useful search brief was found for this topic yet.";
  }

  if (/brief is locked/i.test(message)) {
    return "This brief is locked because its article is already written.";
  }

  if (/timed?\s*out|timeout/i.test(message)) {
    return "The brief search took too long. Please try again.";
  }

  return defaultTopicBriefFailureMessage;
};
