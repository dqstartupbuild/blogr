"use client";

import { useMemo, useState } from "react";
import { demoBlogs } from "../constants/demoBlogs";
import { demoProduct } from "../constants/demoProduct";
import { demoTopics } from "../constants/demoTopics";
import type { BlogItem } from "../types/BlogItem";
import type { ProductProfile } from "../types/ProductProfile";
import type { TopicItem } from "../types/TopicItem";
import type { WorkspaceViewMode } from "../types/WorkspaceViewMode";

export const useDemoWorkspace = (initialMode: WorkspaceViewMode) => {
  const [mode, setMode] = useState<WorkspaceViewMode>(initialMode);
  const [product, setProduct] = useState<ProductProfile>(demoProduct);
  const [productScanMessage, setProductScanMessage] = useState("");
  const [isScanningProduct, setIsScanningProduct] = useState(false);
  const [topics, setTopics] = useState<TopicItem[]>(demoTopics);
  const [blogs, setBlogs] = useState<BlogItem[]>(demoBlogs);
  const [selectedBlogId, setSelectedBlogId] = useState(demoBlogs[0]?.id ?? "");

  const selectedBlog = useMemo(
    () => blogs.find((blog) => blog.id === selectedBlogId) ?? blogs[0],
    [blogs, selectedBlogId],
  );

  const scanProduct = (websiteUrl: string, niche: string) => {
    setIsScanningProduct(true);
    setProduct((current) => ({
      ...current,
      websiteUrl,
      niche,
    }));
    setProductScanMessage("Saved in preview.");
    setIsScanningProduct(false);
  };

  const addTopic = (keyword: string) => {
    const trimmed = keyword.trim();
    if (!trimmed) return;

    setTopics((current) => [
      {
        id: `topic-${Date.now()}`,
        keyword: trimmed,
        status: "saved",
      },
      ...current,
    ]);
  };

  const writeBlog = (topicId: string) => {
    const topic = topics.find((item) => item.id === topicId);
    if (!topic) return;

    const blogId = `blog-${Date.now()}`;
    const title = `A Simple Guide to ${topic.keyword}`;
    const nextBlog: BlogItem = {
      id: blogId,
      keyword: topic.keyword,
      title,
      slug: topic.keyword.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      excerpt: `A clear, friendly draft about ${topic.keyword}.`,
      status: "ready",
      mdx: `# ${title}\n\nThis draft is ready for the live AI workflow. Add your keys, scan your site, and the app will replace this with the full researched post.`,
      images: [],
      updatedAt: Date.now(),
      internalLinks: product.siteLinks.slice(0, 2),
      youtubeVideos: [],
      sources: [],
    };

    setBlogs((current) => [nextBlog, ...current]);
    setTopics((current) =>
      current.map((item) =>
        item.id === topicId
          ? { ...item, status: "written", blogId }
          : item,
      ),
    );
    setSelectedBlogId(blogId);
    setMode("blogs");
  };

  return {
    mode,
    setMode,
    product,
    productScanState: {
      isScanning: isScanningProduct,
      message: productScanMessage,
    },
    topics,
    blogs,
    selectedBlog,
    selectedBlogId,
    setSelectedBlogId,
    scanProduct,
    addTopic,
    writeBlog,
  };
};
