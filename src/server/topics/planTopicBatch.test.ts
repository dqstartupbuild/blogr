import assert from "node:assert/strict";
import test from "node:test";
// @ts-expect-error -- Node runs this TypeScript test directly with type stripping.
import { planTopicBatch } from "./planTopicBatch.ts";

const originalReplicateToken = process.env.REPLICATE_API_TOKEN;
const originalApifyToken = process.env.APIFY_TOKEN;
const product = {
  audience: "People who repeatedly spend their savings before reaching a goal",
  description: "Bloomin locks savings until a person reaches a chosen goal.",
  name: "Bloomin",
  niche:
    "locked goal savings for people who struggle to stop touching their savings",
  websiteUrl: "https://example.com",
};

test.afterEach(() => {
  if (originalApifyToken === undefined) {
    delete process.env.APIFY_TOKEN;
  } else {
    process.env.APIFY_TOKEN = originalApifyToken;
  }

  if (originalReplicateToken === undefined) {
    delete process.env.REPLICATE_API_TOKEN;
    return;
  }

  process.env.REPLICATE_API_TOKEN = originalReplicateToken;
});

test("fills every requested date without search or AI availability", async () => {
  delete process.env.APIFY_TOKEN;
  delete process.env.REPLICATE_API_TOKEN;

  const blankDates = Array.from(
    { length: 30 },
    (_, index) => `2026-08-${String(index + 1).padStart(2, "0")}`,
  );
  const topics = await planTopicBatch({
    blankDates,
    existingBlogs: [],
    existingTopics: [],
    product,
  });

  assert.equal(topics.length, blankDates.length);
  assert.deepEqual(
    topics.map((topic) => topic.scheduledDate),
    blankDates,
  );
  assert.equal(
    topics.some((topic) =>
      topic.keyword.includes("People who repeatedly spend"),
    ),
    false,
  );
  assert.equal(
    topics.some((topic) =>
      topic.keyword.includes("setup launch checklist steps"),
    ),
    false,
  );
});

test("still fills every date when earlier fallback topics already exist", async () => {
  delete process.env.APIFY_TOKEN;
  delete process.env.REPLICATE_API_TOKEN;

  const firstBatch = await planTopicBatch({
    blankDates: Array.from(
      { length: 15 },
      (_, index) => `2026-08-${String(index + 1).padStart(2, "0")}`,
    ),
    existingBlogs: [],
    existingTopics: [],
    product,
  });
  const secondBatch = await planTopicBatch({
    blankDates: Array.from(
      { length: 30 },
      (_, index) => `2026-09-${String(index + 1).padStart(2, "0")}`,
    ),
    existingBlogs: [],
    existingTopics: firstBatch,
    product,
  });

  assert.equal(secondBatch.length, 30);
});
