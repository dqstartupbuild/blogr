import assert from "node:assert/strict";
import test from "node:test";
import type { Doc } from "../_generated/dataModel";
// @ts-expect-error -- Node runs this TypeScript test directly with type stripping.
import { buildBlogVersionSnapshot } from "./buildBlogVersionSnapshot.ts";

const blog = {
  _id: "blog-1",
  _creationTime: 50,
  createdAt: 100,
  excerpt: "The original summary.",
  images: [],
  internalLinks: [],
  keyword: "history",
  mdx: "# Original article",
  publishedAt: 150,
  slug: "original-article",
  sources: [],
  status: "published",
  title: "Original article",
  updatedAt: 200,
  userId: "user-1",
  youtubeVideos: [],
} as unknown as Doc<"blogs">;

test("keeps the complete article dates and assigns the next version number", () => {
  const snapshot = buildBlogVersionSnapshot(blog, 300, 2);

  assert.equal(snapshot.blogCreatedAt, 100);
  assert.equal(snapshot.blogUpdatedAt, 200);
  assert.equal(snapshot.publishedAt, 150);
  assert.equal(snapshot.archivedAt, 300);
  assert.equal(snapshot.versionNumber, 2);
  assert.equal(snapshot.mdx, "# Original article");
});
