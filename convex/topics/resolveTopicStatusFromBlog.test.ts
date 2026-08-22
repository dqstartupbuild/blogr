import assert from "node:assert/strict";
import test from "node:test";
// @ts-expect-error -- Node runs this TypeScript test directly with type stripping.
import { resolveTopicStatusFromBlog } from "./resolveTopicStatusFromBlog.ts";

test("uses published when the linked article is published", () => {
  assert.equal(resolveTopicStatusFromBlog("published", "written"), "published");
});

test("keeps writing while an unfinished article exists", () => {
  assert.equal(resolveTopicStatusFromBlog("ready", "writing"), "writing");
});

test("uses written for a finished unpublished article", () => {
  assert.equal(resolveTopicStatusFromBlog("ready", "saved"), "written");
});
