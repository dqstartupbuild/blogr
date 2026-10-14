export type AiJobStatusResponse<TResult> = {
  error?: string;
  result?: TResult;
  status?: "queued" | "running" | "succeeded" | "failed";
};
