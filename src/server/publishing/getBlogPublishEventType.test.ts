import assert from "node:assert/strict";
import test from "node:test";
import type { BlogItem } from "@/features/workspace/types/BlogItem";
// @ts-expect-error -- Node runs this TypeScript test directly with type stripping.
import { getBlogPublishEventType } from "./getBlogPublishEventType.ts";

const buildBlog = (status: BlogItem["status"]): BlogItem => ({
  excerpt: "A useful description for readers.",
  id: "blog-1",
  images: [],
  internalLinks: [],
  keyword: "version history",
  mdx: "# Version history",
  seoTitle: "Version history",
  slug: "version-history",
  sources: [],
  status,
  tags: [],
  title: "Version history",
  updatedAt: 100,
  youtubeVideos: [],
});

test("uses publish_articles for a blog that has not been published", () => {
  assert.equal(getBlogPublishEventType(buildBlog("ready")), "publish_articles");
});

test("uses update_article for an already published blog", () => {
  assert.equal(getBlogPublishEventType(buildBlog("published")), "update_article");
});

test("uses update_article for a rewritten article that was published before", () => {
  assert.equal(
    getBlogPublishEventType({
      ...buildBlog("ready"),
      publishedAt: 100,
    }),
    "update_article",
  );
});
