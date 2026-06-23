"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { castProductId } from "@/server/convex/castProductId";
import { createTopicMutation } from "@/server/convex/references/createTopicMutation";
import { getCurrentProductQuery } from "@/server/convex/references/getCurrentProductQuery";
import { listBlogsQuery } from "@/server/convex/references/listBlogsQuery";
import { listTopicsQuery } from "@/server/convex/references/listTopicsQuery";
import { saveProductScanMutation } from "@/server/convex/references/saveProductScanMutation";
import { updateTopicStatusMutation } from "@/server/convex/references/updateTopicStatusMutation";
import { updateBlogGenerationSettingsMutation } from "@/server/convex/references/updateBlogGenerationSettingsMutation";
import { upsertGeneratedBlogMutation } from "@/server/convex/references/upsertGeneratedBlogMutation";
import { castTopicId } from "@/server/convex/castTopicId";
import { buildInitialProductScanProduct } from "../mappers/buildInitialProductScanProduct";
import { mapConvexBlog } from "../mappers/mapConvexBlog";
import { mapConvexProduct } from "../mappers/mapConvexProduct";
import { mapConvexTopic } from "../mappers/mapConvexTopic";
import { mapProductScanResult } from "../mappers/mapProductScanResult";
import { normalizeBlogGenerationSettings } from "../utils/normalizeBlogGenerationSettings";
import type { BlogGenerateResponse } from "../types/BlogGenerateResponse";
import type { BlogGenerationSettings } from "../types/BlogGenerationSettings";
import type { BlogItem } from "../types/BlogItem";
import type { ProductProfile } from "../types/ProductProfile";
import type { ProductScanResponse } from "../types/ProductScanResponse";
import type { WriteBlogOptions } from "../types/WriteBlogOptions";
import type { WorkspaceSwitcherState } from "../types/WorkspaceSwitcherState";
import type { WorkspaceViewMode } from "../types/WorkspaceViewMode";

export const useLiveWorkspace = (
  initialMode: WorkspaceViewMode,
  workspaceSwitcher: WorkspaceSwitcherState,
) => {
  const [mode, setMode] = useState<WorkspaceViewMode>(initialMode);
  const [selectedBlogId, setSelectedBlogId] = useState("");
  const [scannedProduct, setScannedProduct] = useState<{
    product: ProductProfile;
    productId: string;
  } | null>(null);
  const [productScanMessage, setProductScanMessage] = useState("");
  const [isScanningProduct, setIsScanningProduct] = useState(false);
  const [settingsStatusMessage, setSettingsStatusMessage] = useState("");
  const [isSavingBlogGenerationSettings, setIsSavingBlogGenerationSettings] =
    useState(false);
  const activeProductId = workspaceSwitcher.activeWorkspaceId;
  const convexProductId = activeProductId
    ? castProductId(activeProductId)
    : null;
  const productResult = useQuery(
    getCurrentProductQuery,
    activeProductId ? {} : "skip",
  );
  const topicResults = useQuery(
    listTopicsQuery,
    convexProductId ? { productId: convexProductId } : "skip",
  );
  const blogResults = useQuery(
    listBlogsQuery,
    convexProductId ? { productId: convexProductId } : "skip",
  );
  const createTopic = useMutation(createTopicMutation);
  const saveProductScan = useMutation(saveProductScanMutation);
  const updateBlogGenerationSettings = useMutation(
    updateBlogGenerationSettingsMutation,
  );
  const updateTopicStatus = useMutation(updateTopicStatusMutation);
  const upsertGeneratedBlog = useMutation(upsertGeneratedBlogMutation);
  const visibleScannedProduct =
    scannedProduct?.productId === activeProductId ? scannedProduct.product : null;
  const product = visibleScannedProduct || mapConvexProduct(productResult);
  const blogGenerationSettings = normalizeBlogGenerationSettings(
    productResult?.blogGenerationSettings,
  );
  const topics = useMemo(
    () => (topicResults || []).map(mapConvexTopic),
    [topicResults],
  );
  const blogs: BlogItem[] = useMemo(
    () => (blogResults || []).map(mapConvexBlog),
    [blogResults],
  );
  const activeSelectedBlogId =
    blogs.find((blog) => blog.id === selectedBlogId)?.id || blogs[0]?.id || "";
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

      const savedProductId = await saveProductScan({
        ...initialProduct,
        productId: convexProductId || undefined,
      });
      savedInitialProduct = true;
      setScannedProduct({
        product: mapProductScanResult(initialProduct),
        productId: savedProductId,
      });
      setProductScanMessage("Saved your site. Scanning for details.");

      const response = await fetch("/api/product/scan", {
        body: JSON.stringify({ niche, productId: savedProductId, websiteUrl }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });
      const data = (await response
        .json()
        .catch(() => ({}))) as ProductScanResponse;

      if (!response.ok) {
        throw new Error(data.error || "Could not scan that site yet.");
      }

      if (data.product) {
        const savedProductId = await saveProductScan({
          ...data.product,
          productId: convexProductId || undefined,
        });
        setScannedProduct({
          product: mapProductScanResult(data.product),
          productId: savedProductId,
        });
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
    if (!convexProductId) {
      return;
    }

    await createTopic({
      keyword,
      productId: convexProductId,
    });
  };

  const saveBlogGenerationSettings = async (
    settings: BlogGenerationSettings,
  ) => {
    if (!convexProductId) {
      setSettingsStatusMessage("Choose a workspace first.");
      return;
    }

    setIsSavingBlogGenerationSettings(true);
    setSettingsStatusMessage("");

    try {
      await updateBlogGenerationSettings({
        productId: convexProductId,
        settings,
      });
      setSettingsStatusMessage("Settings saved.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not save settings.";
      setSettingsStatusMessage(message);
    } finally {
      setIsSavingBlogGenerationSettings(false);
    }
  };

  const writeBlog = async (topicId: string, options?: WriteBlogOptions) => {
    const topic = topics.find((item) => item.id === topicId);
    const sourceText = options?.sourceText?.trim();

    if (!topic) {
      return;
    }

    const convexTopicId = castTopicId(topicId);

    if (!convexProductId) {
      return;
    }

    if (!productResult) {
      await updateTopicStatus({
        lastError: "Scan your product website first.",
        productId: convexProductId || undefined,
        status: "failed",
        topicId: convexTopicId,
      }).catch(() => undefined);
      return;
    }

    await updateTopicStatus({
      productId: convexProductId || undefined,
      status: "writing",
      topicId: convexTopicId,
    });

    try {
      const response = await fetch("/api/blogs/generate", {
        body: JSON.stringify({
          blogGenerationSettings,
          keyword: topic.keyword,
          product: productResult,
          productId: activeProductId,
          sourceText: sourceText || undefined,
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
        productId: convexProductId,
        topicId: convexTopicId,
      });

      setSelectedBlogId(blogId);
      setMode("blogs");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not write that blog yet.";
      await updateTopicStatus({
        lastError: message,
        productId: convexProductId || undefined,
        status: "failed",
        topicId: convexTopicId,
      }).catch(() => undefined);
    }
  };

  return {
    addTopic,
    blogGenerationSettings,
    blogs,
    isSavingBlogGenerationSettings,
    mode,
    product,
    productScanState: {
      isScanning: isScanningProduct,
      message: productScanMessage,
    },
    saveBlogGenerationSettings,
    scanProduct,
    selectedBlog,
    selectedBlogId: activeSelectedBlogId,
    settingsStatusMessage,
    setMode,
    setSelectedBlogId,
    topics,
    workspaceSwitcher,
    writeBlog,
  };
};
