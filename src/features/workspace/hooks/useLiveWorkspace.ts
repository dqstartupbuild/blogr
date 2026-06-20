"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { createTopicMutation } from "@/server/convex/references/createTopicMutation";
import { getCurrentProductQuery } from "@/server/convex/references/getCurrentProductQuery";
import { listBlogsQuery } from "@/server/convex/references/listBlogsQuery";
import { listTopicsQuery } from "@/server/convex/references/listTopicsQuery";
import { saveProductScanMutation } from "@/server/convex/references/saveProductScanMutation";
import { updateTopicStatusMutation } from "@/server/convex/references/updateTopicStatusMutation";
import { upsertGeneratedBlogMutation } from "@/server/convex/references/upsertGeneratedBlogMutation";
import { castTopicId } from "@/server/convex/castTopicId";
import { buildInitialProductScanProduct } from "../mappers/buildInitialProductScanProduct";
import { mapConvexBlog } from "../mappers/mapConvexBlog";
import { mapConvexProduct } from "../mappers/mapConvexProduct";
import { mapConvexTopic } from "../mappers/mapConvexTopic";
import { mapProductScanResult } from "../mappers/mapProductScanResult";
import type { BlogGenerateResponse } from "../types/BlogGenerateResponse";
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
  const saveProductScan = useMutation(saveProductScanMutation);
  const updateTopicStatus = useMutation(updateTopicStatusMutation);
  const upsertGeneratedBlog = useMutation(upsertGeneratedBlogMutation);
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
    let savedInitialProduct = false;

    try {
      const initialProduct = buildInitialProductScanProduct({
        niche,
        websiteUrl,
      });

      await saveProductScan(initialProduct);
      savedInitialProduct = true;
      setScannedProduct(mapProductScanResult(initialProduct));
      setProductScanMessage("Saved your site. Scanning for details.");

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
        await saveProductScan(data.product);
        setScannedProduct(mapProductScanResult(data.product));
      }

      setProductScanMessage("Saved your product details.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not scan that site yet.";

      setProductScanMessage(
        savedInitialProduct ? `${message} We still saved your site.` : message,
      );
    } finally {
      setIsScanningProduct(false);
    }
  };

  const addTopic = async (keyword: string) => {
    await createTopic({ keyword });
  };

  const writeBlog = async (topicId: string) => {
    const topic = topics.find((item) => item.id === topicId);

    if (!topic) {
      return;
    }

    const convexTopicId = castTopicId(topicId);

    if (!productResult) {
      await updateTopicStatus({
        lastError: "Scan your product website first.",
        status: "failed",
        topicId: convexTopicId,
      }).catch(() => undefined);
      return;
    }

    await updateTopicStatus({ status: "writing", topicId: convexTopicId });

    try {
      const response = await fetch("/api/blogs/generate", {
        body: JSON.stringify({
          keyword: topic.keyword,
          product: productResult,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });
      const data = (await response
        .json()
        .catch(() => ({}))) as BlogGenerateResponse;

      if (!response.ok || !data.blog) {
        throw new Error(data.error || "Could not write that blog yet.");
      }

      const blogId = await upsertGeneratedBlog({
        ...data.blog,
        topicId: convexTopicId,
      });

      setSelectedBlogId(blogId);
      setMode("blogs");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not write that blog yet.";
      await updateTopicStatus({
        lastError: message,
        status: "failed",
        topicId: convexTopicId,
      }).catch(() => undefined);
    }
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
