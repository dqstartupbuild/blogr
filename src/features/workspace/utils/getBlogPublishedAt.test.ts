import assert from "node:assert/strict";
import test from "node:test";
// @ts-expect-error -- Node runs this TypeScript test directly with type stripping.
import { getBlogPublishedAt } from "./getBlogPublishedAt.ts";

const baseBlog = {
  excerpt: "Excerpt",
  id: "blog-1",
  images: [],
  internalLinks: [],
  keyword: "keyword",
  mdx: "Article",
  seoTitle: "Title",
  slug: "title",
  sources: [],
  status: "published" as const,
  tags: [],
  title: "Title",
  updatedAt: 200,
  youtubeVideos: [],
};

test("uses the stored publication time", () => {
  assert.equal(getBlogPublishedAt({ ...baseBlog, publishedAt: 100 }), 100);
});

test("uses the last known update for older published articles", () => {
  assert.equal(getBlogPublishedAt(baseBlog), 200);
});

test("does not invent a publication time for an unpublished article", () => {
  assert.equal(getBlogPublishedAt({ ...baseBlog, status: "ready" }), undefined);
});
