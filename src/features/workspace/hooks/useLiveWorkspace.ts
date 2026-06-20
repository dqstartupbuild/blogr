"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { createTopicMutation } from "@/server/convex/references/createTopicMutation";
import { getCurrentProductQuery } from "@/server/convex/references/getCurrentProductQuery";
import { listBlogsQuery } from "@/server/convex/references/listBlogsQuery";
import { listTopicsQuery } from "@/server/convex/references/listTopicsQuery";
import { mapConvexBlog } from "../mappers/mapConvexBlog";
import { mapConvexProduct } from "../mappers/mapConvexProduct";
import { mapConvexTopic } from "../mappers/mapConvexTopic";
import { mapProductScanResult } from "../mappers/mapProductScanResult";
import type { BlogItem } from "../types/BlogItem";
import type { ProductProfile } from "../types/ProductProfile";
import type { ProductScanResponse } from "../types/ProductScanResponse";
import type { WorkspaceViewMode } from "../types/WorkspaceViewMode";

export const useLiveWorkspace = (initialMode: WorkspaceViewMode) => {
  const [mode, setMode] = useState<WorkspaceViewMode>(initialMode);
  const [selectedBlogId, setSelectedBlogId] = useState("");
  const [scannedProduct, setScannedProduct] = useState<ProductProfile | null>(
    null,
  );
  const [productScanMessage, setProductScanMessage] = useState("");
  const [isScanningProduct, setIsScanningProduct] = useState(false);
  const productResult = useQuery(getCurrentProductQuery);
  const topicResults = useQuery(listTopicsQuery);
  const blogResults = useQuery(listBlogsQuery);
  const createTopic = useMutation(createTopicMutation);
  const product = scannedProduct || mapConvexProduct(productResult);
  const topics = useMemo(
    () => (topicResults || []).map(mapConvexTopic),
    [topicResults],
  );
  const blogs: BlogItem[] = useMemo(
    () => (blogResults || []).map(mapConvexBlog),
    [blogResults],
  );
  const activeSelectedBlogId = selectedBlogId || blogs[0]?.id || "";
  const selectedBlog = useMemo(
    () => blogs.find((blog) => blog.id === activeSelectedBlogId) ?? blogs[0],
    [blogs, activeSelectedBlogId],
  );

  const scanProduct = async (websiteUrl: string, niche: string) => {
    setIsScanningProduct(true);
    setProductScanMessage("Scanning your site.");

    try {
      const response = await fetch("/api/product/scan", {
        body: JSON.stringify({ niche, websiteUrl }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });
      const data = (await response.json().catch(() => ({}))) as ProductScanResponse;

      if (!response.ok) {
        throw new Error(data.error || "Could not scan that site yet.");
      }

      if (data.product) {
        setScannedProduct(mapProductScanResult(data.product));
      }

      setProductScanMessage(
        data.saved
          ? "Saved your product details."
          : "Scanned your site, but it was not saved yet.",
      );
    } catch (error) {
      setProductScanMessage(
        error instanceof Error ? error.message : "Could not scan that site yet.",
      );
    } finally {
      setIsScanningProduct(false);
    }
  };

  const addTopic = async (keyword: string) => {
    await createTopic({ keyword });
  };

  const writeBlog = async (topicId: string) => {
    const response = await fetch("/api/blogs/generate", {
      body: JSON.stringify({ topicId }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    if (!response.ok) {
      throw new Error("Could not write that blog yet.");
    }

    setMode("blogs");
  };

  return {
    addTopic,
    blogs,
    mode,
    product,
    productScanState: {
      isScanning: isScanningProduct,
      message: productScanMessage,
    },
    scanProduct,
    selectedBlog,
    selectedBlogId: activeSelectedBlogId,
    setMode,
    setSelectedBlogId,
    topics,
    writeBlog,
  };
};
