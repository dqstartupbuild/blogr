import assert from "node:assert/strict";
import test from "node:test";
// @ts-expect-error -- Node runs this TypeScript test directly with type stripping.
import { getBlogAiJobRouteWaitMs } from "./getBlogAiJobRouteWaitMs.ts";

const originalRouteWaitMs = process.env.BLOG_AI_JOB_ROUTE_WAIT_MS;

test.afterEach(() => {
  if (originalRouteWaitMs === undefined) {
    delete process.env.BLOG_AI_JOB_ROUTE_WAIT_MS;
    return;
  }

  process.env.BLOG_AI_JOB_ROUTE_WAIT_MS = originalRouteWaitMs;
});

test("uses the safe route wait when the setting is missing", () => {
  delete process.env.BLOG_AI_JOB_ROUTE_WAIT_MS;

  assert.equal(getBlogAiJobRouteWaitMs(), 240000);
});

test("keeps a shorter configured route wait", () => {
  process.env.BLOG_AI_JOB_ROUTE_WAIT_MS = "120000";

  assert.equal(getBlogAiJobRouteWaitMs(), 120000);
});

test("caps a configured route wait below the function limit", () => {
  process.env.BLOG_AI_JOB_ROUTE_WAIT_MS = "280000";

  assert.equal(getBlogAiJobRouteWaitMs(), 240000);
});

test("supports a shorter route-specific wait", () => {
  process.env.BLOG_AI_JOB_ROUTE_WAIT_MS = "240000";

  assert.equal(getBlogAiJobRouteWaitMs(90000), 90000);
});
