import assert from "node:assert/strict";
import test from "node:test";
// @ts-expect-error -- Node runs this TypeScript test directly with type stripping.
import { resolveBlogPublishedAt } from "./resolveBlogPublishedAt.ts";

test("records the first successful publication time", () => {
  assert.equal(resolveBlogPublishedAt("published", undefined, 200), 200);
});

test("preserves the first publication time when publishing again", () => {
  assert.equal(resolveBlogPublishedAt("published", 100, 200), 100);
});

test("keeps an existing publication time after later edits", () => {
  assert.equal(resolveBlogPublishedAt("ready", 100, 200), 100);
});
