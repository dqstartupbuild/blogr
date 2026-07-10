const initialPollDelayMs = 2000;
const maximumPollDelayMs = 15000;

export const getBlogAiJobPollDelayMs = (pollCount: number) => {
  return Math.min(
    initialPollDelayMs * Math.pow(1.6, Math.max(0, pollCount)),
    maximumPollDelayMs,
  );
};
