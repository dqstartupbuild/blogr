import Replicate from "replicate";
import { describe, expect, it, vi } from "vitest";
import { createRetryingReplicateImageFetch } from "./createRetryingReplicateImageFetch";

describe("createRetryingReplicateImageFetch", () => {
  it("retries a 429 using Retry-After seconds before succeeding", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(null, { headers: { "Retry-After": "2" }, status: 429 }),
      )
      .mockResolvedValueOnce(new Response(null, { status: 200 }));
    const wait = vi.fn().mockResolvedValue(undefined);
    const onRetry = vi.fn();
    const fetch = createRetryingReplicateImageFetch({
      fetch: fetchMock,
      onRetry,
      wait,
    });

    await expect(fetch("https://api.replicate.com/v1/predictions/test")).resolves.toMatchObject({
      status: 200,
    });
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(wait).toHaveBeenCalledWith(2_000);
    expect(onRetry).toHaveBeenCalledWith({
      attempt: 1,
      delayMs: 2_000,
      status: 429,
    });
  });

  it("retries a 429 using an HTTP-date Retry-After value", async () => {
    const now = Date.UTC(2026, 0, 1, 0, 0, 0);
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(null, {
          headers: {
            "Retry-After": new Date(now + 30_000).toUTCString(),
          },
          status: 429,
        }),
      )
      .mockResolvedValueOnce(new Response(null, { status: 200 }));
    const wait = vi.fn().mockResolvedValue(undefined);
    const onRetry = vi.fn();
    const fetch = createRetryingReplicateImageFetch({
      fetch: fetchMock,
      now: () => now,
      onRetry,
      wait,
    });

    await fetch("https://api.replicate.com/v1/predictions/test");

    expect(wait).toHaveBeenCalledWith(30_000);
    expect(onRetry).toHaveBeenCalledWith({
      attempt: 1,
      delayMs: 30_000,
      status: 429,
    });
  });

  it("returns exhausted 429s and never retries permanent failures", async () => {
    const exhaustedFetchMock = vi
      .fn()
      .mockResolvedValue(new Response(null, { status: 429 }));
    const wait = vi.fn().mockResolvedValue(undefined);
    const exhaustedFetch = createRetryingReplicateImageFetch({
      fetch: exhaustedFetchMock,
      wait,
    });

    await expect(
      exhaustedFetch("https://api.replicate.com/v1/predictions/test"),
    ).resolves.toMatchObject({ status: 429 });
    expect(exhaustedFetchMock).toHaveBeenCalledTimes(4);
    expect(wait).toHaveBeenCalledTimes(3);
    expect(wait).toHaveBeenLastCalledWith(10_000);

    const permanentFetchMock = vi
      .fn()
      .mockResolvedValue(new Response(null, { status: 422 }));
    const permanentFetch = createRetryingReplicateImageFetch({
      fetch: permanentFetchMock,
      wait,
    });

    await expect(
      permanentFetch("https://api.replicate.com/v1/predictions/test"),
    ).resolves.toMatchObject({ status: 422 });
    expect(permanentFetchMock).toHaveBeenCalledTimes(1);
    expect(wait).toHaveBeenCalledTimes(3);
  });

  it("stops instead of retrying before a Retry-After beyond the wait limit", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        new Response(null, { headers: { "Retry-After": "61" }, status: 429 }),
      );
    const wait = vi.fn().mockResolvedValue(undefined);
    const onRetry = vi.fn();
    const fetch = createRetryingReplicateImageFetch({
      fetch: fetchMock,
      onRetry,
      wait,
    });

    await expect(
      fetch("https://api.replicate.com/v1/predictions/test"),
    ).resolves.toMatchObject({ status: 429 });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(wait).not.toHaveBeenCalled();
    expect(onRetry).not.toHaveBeenCalled();
  });

  it("retries GET 5xx responses without retrying POST 5xx responses", async () => {
    const getFetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response(null, { status: 503 }))
      .mockResolvedValueOnce(new Response(null, { status: 200 }));
    const getWait = vi.fn().mockResolvedValue(undefined);
    const getFetch = createRetryingReplicateImageFetch({
      fetch: getFetchMock,
      wait: getWait,
    });

    await getFetch("https://api.replicate.com/v1/predictions/test");
    expect(getFetchMock).toHaveBeenCalledTimes(2);
    expect(getWait).toHaveBeenCalledWith(10_000);

    const postFetchMock = vi
      .fn()
      .mockResolvedValue(new Response(null, { status: 503 }));
    const postFetch = createRetryingReplicateImageFetch({
      fetch: postFetchMock,
      wait: getWait,
    });

    await postFetch("https://api.replicate.com/v1/predictions/test", {
      method: "POST",
    });
    expect(postFetchMock).toHaveBeenCalledTimes(1);
  });

  it("limits the real SDK to four physical calls after exhausted 429s", async () => {
    const rawFetch = vi
      .fn()
      .mockResolvedValue(new Response(null, { status: 429 }));
    const wait = vi.fn().mockResolvedValue(undefined);
    const client = new Replicate({
      auth: "test-token",
      fetch: createRetryingReplicateImageFetch({ fetch: rawFetch, wait }),
    });

    await expect(
      client.run("google/nano-banana-2", {
        input: { prompt: "test" },
        wait: { mode: "poll" },
      }),
    ).rejects.toThrow("status 429");
    expect(rawFetch).toHaveBeenCalledTimes(4);
    expect(wait).toHaveBeenCalledTimes(3);
  });
});
