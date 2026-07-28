import assert from "node:assert/strict";
import test from "node:test";
import type { BlogItem } from "@/features/workspace/types/BlogItem";
// @ts-expect-error -- Node runs this TypeScript test directly with type stripping.
import { getBlogPublishCreatedAt } from "./getBlogPublishCreatedAt.ts";

const blog = {
  createdAt: Date.parse("2026-01-01T12:00:00.000Z"),
  publishedAt: Date.parse("2026-02-01T12:00:00.000Z"),
  updatedAt: Date.parse("2026-03-01T12:00:00.000Z"),
} as BlogItem;
const latestPublishTimestamp = "2026-04-01T12:00:00.000Z";

test("uses the current publish time when an article first goes live", () => {
  assert.equal(
    getBlogPublishCreatedAt(
      blog,
      "publish_articles",
      latestPublishTimestamp,
    ),
    latestPublishTimestamp,
  );
});

test("preserves the original publication time when an article is updated", () => {
  assert.equal(
    getBlogPublishCreatedAt(blog, "update_article", latestPublishTimestamp),
    "2026-02-01T12:00:00.000Z",
  );
});
