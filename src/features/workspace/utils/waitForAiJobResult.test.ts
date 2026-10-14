import assert from "node:assert/strict";
import test from "node:test";
// @ts-expect-error -- Node runs this TypeScript test directly with type stripping.
import { waitForAiJobResult } from "./waitForAiJobResult.ts";

const originalFetch = globalThis.fetch;

test.afterEach(() => {
  globalThis.fetch = originalFetch;
});

test("returns a completed background job result", async () => {
  globalThis.fetch = async () =>
    Response.json({ result: { value: "done" }, status: "succeeded" });

  const result = await waitForAiJobResult<{ value: string }>({
    jobId: "job-1",
  });

  assert.deepEqual(result, { value: "done" });
});

test("keeps checking a running background job", async () => {
  let requestCount = 0;

  globalThis.fetch = async () => {
    requestCount += 1;

    return requestCount === 1
      ? Response.json({ status: "running" })
      : Response.json({ result: { value: "done" }, status: "succeeded" });
  };

  const result = await waitForAiJobResult<{ value: string }>({
    jobId: "job-2",
    maximumWaitMs: 100,
    pollDelayMs: 1,
  });

  assert.deepEqual(result, { value: "done" });
  assert.equal(requestCount, 2);
});

test("reports a failed background job", async () => {
  globalThis.fetch = async () =>
    Response.json({ error: "Search failed.", status: "failed" });

  await assert.rejects(
    waitForAiJobResult({ jobId: "job-3" }),
    /Search failed/,
  );
});
