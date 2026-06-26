"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { castBlogId } from "@/server/convex/castBlogId";
import { castProductId } from "@/server/convex/castProductId";
import { createTopicMutation } from "@/server/convex/references/createTopicMutation";
import { deleteBlogMutation } from "@/server/convex/references/deleteBlogMutation";
import { deleteTopicMutation } from "@/server/convex/references/deleteTopicMutation";
import { getCurrentProductQuery } from "@/server/convex/references/getCurrentProductQuery";
import { listBlogsQuery } from "@/server/convex/references/listBlogsQuery";
import { listTopicsQuery } from "@/server/convex/references/listTopicsQuery";
import { saveProductScanMutation } from "@/server/convex/references/saveProductScanMutation";
import { updateBlogPublishingIntegrationMutation } from "@/server/convex/references/updateBlogPublishingIntegrationMutation";
import { updateProductSiteLinksMutation } from "@/server/convex/references/updateProductSiteLinksMutation";
import { updateTopicNotesMutation } from "@/server/convex/references/updateTopicNotesMutation";
import { updateTopicStatusMutation } from "@/server/convex/references/updateTopicStatusMutation";
import { updateBlogGenerationSettingsMutation } from "@/server/convex/references/updateBlogGenerationSettingsMutation";
import { upsertGeneratedBlogMutation } from "@/server/convex/references/upsertGeneratedBlogMutation";
import { castTopicId } from "@/server/convex/castTopicId";
import { buildInitialProductScanProduct } from "../mappers/buildInitialProductScanProduct";
import { mapConvexBlog } from "../mappers/mapConvexBlog";
import { mapConvexProduct } from "../mappers/mapConvexProduct";
import { mapConvexTopic } from "../mappers/mapConvexTopic";
import { mapProductScanResult } from "../mappers/mapProductScanResult";
import { buildBlogRefreshSeedKeyword } from "../utils/buildBlogRefreshSeedKeyword";
import { buildExistingTopicBriefNotes } from "../utils/buildExistingTopicBriefNotes";
import { filterActiveLinks } from "../utils/filterActiveLinks";
import { mergeProductLinkStates } from "../utils/mergeProductLinkStates";
import { normalizeBlogGenerationSettings } from "../utils/normalizeBlogGenerationSettings";
import { setProductLinkActiveState } from "../utils/setProductLinkActiveState";
import type { BlogGenerateResponse } from "../types/BlogGenerateResponse";
import type { BlogGenerationSettings } from "../types/BlogGenerationSettings";
import type { BlogItem } from "../types/BlogItem";
import type { ProductProfile } from "../types/ProductProfile";
import type { ProductLinksRefreshResponse } from "../types/ProductLinksRefreshResponse";
import type { ProductScanResponse } from "../types/ProductScanResponse";
import type { WriteBlogOptions } from "../types/WriteBlogOptions";
import type { WorkspaceSwitcherState } from "../types/WorkspaceSwitcherState";
import type { WorkspaceViewMode } from "../types/WorkspaceViewMode";
import type { BlogPublishingIntegrationDraft } from "../types/integrations/BlogPublishingIntegrationDraft";
import type { TopicDiscoveryRequest } from "../types/topicDiscovery/TopicDiscoveryRequest";
import type { TopicDiscoveryResponse } from "../types/topicDiscovery/TopicDiscoveryResponse";

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
  const [productLinksMessage, setProductLinksMessage] = useState("");
  const [isRefreshingProductLinks, setIsRefreshingProductLinks] =
    useState(false);
  const [settingsStatusMessage, setSettingsStatusMessage] = useState("");
  const [
    publishingIntegrationStatusMessage,
    setPublishingIntegrationStatusMessage,
  ] = useState("");
  const [isSavingBlogGenerationSettings, setIsSavingBlogGenerationSettings] =
    useState(false);
  const [
    isSavingBlogPublishingIntegration,
    setIsSavingBlogPublishingIntegration,
  ] = useState(false);
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
  const deleteBlogRecord = useMutation(deleteBlogMutation);
  const deleteTopicRecord = useMutation(deleteTopicMutation);
  const saveProductScan = useMutation(saveProductScanMutation);
  const updateProductSiteLinks = useMutation(updateProductSiteLinksMutation);
  const updateBlogGenerationSettings = useMutation(
    updateBlogGenerationSettingsMutation,
  );
  const updateBlogPublishingIntegration = useMutation(
    updateBlogPublishingIntegrationMutation,
  );
  const updateTopicNotes = useMutation(updateTopicNotesMutation);
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
        const siteLinks = mergeProductLinkStates({
          currentLinks: product.siteLinks,
          refreshedLinks: data.product.siteLinks,
        });
        const savedProductId = await saveProductScan({
          ...data.product,
          siteLinks,
          productId: convexProductId || undefined,
        });
        setScannedProduct({
          product: mapProductScanResult({ ...data.product, siteLinks }),
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

  const refreshProductLinks = async () => {
    if (!convexProductId) {
      setProductLinksMessage("Choose a workspace first.");
      return;
    }

    if (!product.websiteUrl.trim()) {
      setProductLinksMessage("Add your website first.");
      return;
    }

    setIsRefreshingProductLinks(true);
    setProductLinksMessage("Refreshing links.");

    try {
      const response = await fetch("/api/product/links/refresh", {
        body: JSON.stringify({ websiteUrl: product.websiteUrl }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });
      const data = (await response
        .json()
        .catch(() => ({}))) as ProductLinksRefreshResponse;

      if (!response.ok || !data.siteLinks) {
        throw new Error(data.error || "Could not refresh links yet.");
      }

      const siteLinks = mergeProductLinkStates({
        currentLinks: product.siteLinks,
        refreshedLinks: data.siteLinks,
      });

      await updateProductSiteLinks({
        productId: convexProductId,
        siteLinks,
      });
      setScannedProduct({
        product: {
          ...product,
          siteLinks,
        },
        productId: activeProductId,
      });
      setProductLinksMessage("Links refreshed.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not refresh links yet.";
      setProductLinksMessage(message);
    } finally {
      setIsRefreshingProductLinks(false);
    }
  };

  const setProductLinkActive = async (url: string, isActive: boolean) => {
    if (!convexProductId) {
      setProductLinksMessage("Choose a workspace first.");
      return;
    }

    const siteLinks = setProductLinkActiveState({
      isActive,
      links: product.siteLinks,
      url,
    });

    try {
      await updateProductSiteLinks({
        productId: convexProductId,
        siteLinks,
      });
      setScannedProduct({
        product: {
          ...product,
          siteLinks,
        },
        productId: activeProductId,
      });
      setProductLinksMessage(
        isActive ? "Link turned back on." : "Link paused.",
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not save that link.";
      setProductLinksMessage(message);
    }
  };

  const addTopic = async (keyword: string, notes?: string) => {
    if (!convexProductId) {
      return;
    }

    await createTopic({
      keyword,
      notes,
      productId: convexProductId,
    });
  };

  const discoverTopicIdeas = async ({
    includeAiAnswers,
    seedKeyword,
  }: TopicDiscoveryRequest) => {
    const discoveryProduct = productResult
      ? {
          audience: productResult.audience,
          competitors: productResult.competitors,
          description: productResult.description,
          name: productResult.name,
          niche: productResult.niche,
          rawContext: productResult.rawContext,
          siteLinks: filterActiveLinks(productResult.siteLinks),
          websiteUrl: productResult.websiteUrl,
        }
      : {
          ...product,
          siteLinks: filterActiveLinks(product.siteLinks),
        };

    if (
      !seedKeyword?.trim() &&
      !discoveryProduct.niche?.trim() &&
      !discoveryProduct.description?.trim()
    ) {
      throw new Error("Add a product niche or seed keyword first.");
    }

    const response = await fetch("/api/topics/discover", {
      body: JSON.stringify({
        existingBlogs: blogs.map((blog) => ({
          excerpt: blog.excerpt,
          keyword: blog.keyword,
          title: blog.title,
          updatedAt: blog.updatedAt,
        })),
        existingTopics: topics.map((topic) => ({
          keyword: topic.keyword,
        })),
        includeAiAnswers,
        product: discoveryProduct,
        seedKeyword,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });
    const data = (await response
      .json()
      .catch(() => ({}))) as TopicDiscoveryResponse;

    if (!response.ok || !data.discovery) {
      throw new Error(data.error || "Could not find topic ideas yet.");
    }

    return data.discovery;
  };

  const refreshTopicBrief = async (topicId: string) => {
    const topic = topics.find((item) => item.id === topicId);

    if (!topic) {
      throw new Error("Topic not found.");
    }

    if (!convexProductId) {
      throw new Error("Choose a workspace first.");
    }

    const discovery = await discoverTopicIdeas({
      includeAiAnswers: false,
      seedKeyword: topic.keyword,
    });
    const notes = buildExistingTopicBriefNotes(topic, discovery);

    if (!notes.trim()) {
      throw new Error("No search brief was found for this topic.");
    }

    await updateTopicNotes({
      notes,
      productId: convexProductId,
      topicId: castTopicId(topicId),
    });

    return notes;
  };

  const deleteTopic = async (topicId: string) => {
    await deleteTopicRecord({
      productId: convexProductId || undefined,
      topicId: castTopicId(topicId),
    });
  };

  const discoverBlogRefreshIdeas = async (
    blogId: string,
    { includeAiAnswers, seedKeyword }: TopicDiscoveryRequest,
  ) => {
    const blog = blogs.find((item) => item.id === blogId);

    if (!blog) {
      throw new Error("Blog not found.");
    }

    const discoveryProduct = productResult
      ? {
          audience: productResult.audience,
          competitors: productResult.competitors,
          description: productResult.description,
          name: productResult.name,
          niche: productResult.niche,
          rawContext: productResult.rawContext,
          siteLinks: filterActiveLinks(productResult.siteLinks),
          websiteUrl: productResult.websiteUrl,
        }
      : {
          ...product,
          siteLinks: filterActiveLinks(product.siteLinks),
        };
    const searchKeyword =
      seedKeyword?.trim() || buildBlogRefreshSeedKeyword(blog);

    if (!searchKeyword) {
      throw new Error("Add a keyword or title before searching.");
    }

    const response = await fetch("/api/topics/discover", {
      body: JSON.stringify({
        existingBlogs: [
          {
            excerpt: blog.excerpt,
            keyword: blog.keyword,
            title: blog.title,
            updatedAt: blog.updatedAt,
          },
        ],
        existingTopics: topics.map((topic) => ({
          keyword: topic.keyword,
        })),
        includeAiAnswers,
        product: discoveryProduct,
        seedKeyword: searchKeyword,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });
    const data = (await response
      .json()
      .catch(() => ({}))) as TopicDiscoveryResponse;

    if (!response.ok || !data.discovery) {
      throw new Error(data.error || "Could not find refresh ideas yet.");
    }

    return data.discovery;
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

  const saveBlogPublishingIntegration = async (
    integration: BlogPublishingIntegrationDraft,
  ) => {
    if (!convexProductId) {
      setPublishingIntegrationStatusMessage("Choose a workspace first.");
      return;
    }

    setIsSavingBlogPublishingIntegration(true);
    setPublishingIntegrationStatusMessage("");

    try {
      await updateBlogPublishingIntegration({
        accessToken: integration.accessToken,
        enabled: integration.enabled,
        productId: convexProductId,
        sourceName: integration.sourceName,
        webhookUrl: integration.webhookUrl,
      });
      setPublishingIntegrationStatusMessage(
        integration.enabled ? "Publishing connected." : "Publishing removed.",
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Could not save publishing yet.";
      setPublishingIntegrationStatusMessage(message);
    } finally {
      setIsSavingBlogPublishingIntegration(false);
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
          topicBrief: topic.notes,
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

  const deleteBlog = async (blogId: string) => {
    await deleteBlogRecord({
      blogId: castBlogId(blogId),
      productId: convexProductId || undefined,
    });

    if (selectedBlogId === blogId) {
      setSelectedBlogId("");
    }
  };

  const regenerateImage = async (
    blogId: string,
    options: {
      alt?: string;
      imageIndex?: number;
      isFeatureImage?: boolean;
      prompt?: string;
      src?: string;
    },
  ) => {
    const response = await fetch(`/api/blogs/${blogId}/regenerate-image`, {
      body: JSON.stringify({
        alt: options.alt,
        imageIndex: options.imageIndex,
        isFeatureImage: options.isFeatureImage,
        productId: activeProductId,
        prompt: options.prompt,
        src: options.src,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    if (!response.ok) {
      const data = (await response
        .json()
        .catch(() => ({}))) as { error?: string };
      throw new Error(data.error || "Could not refresh that image.");
    }
  };

  return {
    addTopic,
    blogGenerationSettings,
    blogs,
    deleteBlog,
    deleteTopic,
    discoverBlogRefreshIdeas,
    discoverTopicIdeas,
    isSavingBlogPublishingIntegration,
    isSavingBlogGenerationSettings,
    mode,
    product,
    productLinksState: {
      isRefreshing: isRefreshingProductLinks,
      message: productLinksMessage,
    },
    publishingIntegrationStatusMessage,
    productScanState: {
      isScanning: isScanningProduct,
      message: productScanMessage,
    },
    regenerateImage,
    refreshProductLinks,
    saveBlogGenerationSettings,
    saveBlogPublishingIntegration,
    scanProduct,
    selectedBlog,
    selectedBlogId: activeSelectedBlogId,
    settingsStatusMessage,
    refreshTopicBrief,
    setProductLinkActive,
    setMode,
    setSelectedBlogId,
    topics,
    workspaceSwitcher,
    writeBlog,
  };
};
