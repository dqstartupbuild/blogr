import { getReplicateRetryAfterMs } from "./getReplicateRetryAfterMs";

type CreateRetryingReplicateImageFetchOptions = {
  fetch?: (input: Request | string, init?: RequestInit) => Promise<Response>;
  now?: () => number;
  onRetry?: (details: {
    attempt: number;
    delayMs: number;
    status: number;
  }) => void;
  wait?: (milliseconds: number) => Promise<void>;
};

const MAX_REPLICATE_IMAGE_RETRIES = 3;

type ReplicateImageFetch = {
  (input: string | URL | Request, init?: RequestInit): Promise<Response>;
};

export const createRetryingReplicateImageFetch = ({
  fetch = globalThis.fetch,
  now = Date.now,
  onRetry = (details) => console.warn("Replicate image request retrying.", details),
  wait = (milliseconds) =>
    new Promise<void>((resolve) => setTimeout(resolve, milliseconds)),
}: CreateRetryingReplicateImageFetchOptions = {}): ReplicateImageFetch => {
  const exhaustedResponses = new WeakMap<RequestInit, Promise<Response>>();

  return async (input: string | URL | Request, init?: RequestInit) => {
    const cachedResponse = init ? exhaustedResponses.get(init) : undefined;

    if (cachedResponse) {
      return (await cachedResponse).clone();
    }

    const responsePromise = (async () => {
      for (let retries = 0; ; retries += 1) {
        const response = await fetch(input instanceof URL ? input.toString() : input, init);
        const method = init?.method || "GET";
        const isRetryable =
          response.status === 429 || (method === "GET" && response.status >= 500);

        if (!isRetryable || retries === MAX_REPLICATE_IMAGE_RETRIES) {
          return response;
        }

        const delayMs = getReplicateRetryAfterMs({
          now: now(),
          retryAfter: response.headers.get("Retry-After"),
        });

        if (delayMs === null) {
          return response;
        }

        onRetry({ attempt: retries + 1, delayMs, status: response.status });
        await wait(delayMs);
      }
    })();

    if (!init) {
      return await responsePromise;
    }

    exhaustedResponses.set(init, responsePromise);
    const response = await responsePromise;

    if (response.status !== 429 && response.status < 500) {
      exhaustedResponses.delete(init);
    }

    return response;
  };
};
