import type { AiJobStatusResponse } from "../types/AiJobStatusResponse";

type WaitForAiJobResultOptions = {
  jobId: string;
  maximumWaitMs?: number;
  pollDelayMs?: number;
};

const defaultMaximumWaitMs = 300000;
const defaultPollDelayMs = 2000;

export const waitForAiJobResult = async <TResult>({
  jobId,
  maximumWaitMs = defaultMaximumWaitMs,
  pollDelayMs = defaultPollDelayMs,
}: WaitForAiJobResultOptions): Promise<TResult> => {
  const deadline = Date.now() + maximumWaitMs;

  while (Date.now() < deadline) {
    const response = await fetch(`/api/ai-jobs/${encodeURIComponent(jobId)}`, {
      cache: "no-store",
    });
    const data = (await response
      .json()
      .catch(() => ({}))) as AiJobStatusResponse<TResult>;

    if (!response.ok) {
      throw new Error(data.error || "Could not check that background job.");
    }

    if (data.status === "failed") {
      throw new Error(data.error || "That background job did not finish.");
    }

    if (data.status === "succeeded") {
      if (data.result === undefined) {
        throw new Error("That background job finished without a result.");
      }

      return data.result;
    }

    if (data.status !== "queued" && data.status !== "running") {
      throw new Error("Could not read that background job yet.");
    }

    const remainingWaitMs = deadline - Date.now();

    if (remainingWaitMs <= 0) {
      break;
    }

    await new Promise((resolve) =>
      setTimeout(resolve, Math.min(pollDelayMs, remainingWaitMs)),
    );
  }

  throw new Error("This is still running. Please try again in a moment.");
};
