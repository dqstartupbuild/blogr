export const getBlogAiWorkerErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "AI worker failed.";
