const MAX_REPLICATE_RETRY_WAIT_MS = 60_000;
const DEFAULT_REPLICATE_RETRY_WAIT_MS = 10_000;

export const getReplicateRetryAfterMs = ({
  now,
  retryAfter,
}: {
  now: number;
  retryAfter: string | null;
}) => {
  if (!retryAfter) {
    return DEFAULT_REPLICATE_RETRY_WAIT_MS;
  }

  const seconds = Number(retryAfter);

  if (Number.isFinite(seconds) && seconds >= 0) {
    const delayMs = seconds * 1000;
    return delayMs > MAX_REPLICATE_RETRY_WAIT_MS ? null : delayMs;
  }

  const retryAt = Date.parse(retryAfter);

  if (Number.isNaN(retryAt)) {
    return DEFAULT_REPLICATE_RETRY_WAIT_MS;
  }

  const delayMs = Math.max(retryAt - now, 0);

  return delayMs > MAX_REPLICATE_RETRY_WAIT_MS ? null : delayMs;
};
