"use client";

import { useEffect, useMemo, useState } from "react";
import { demoBlogs } from "../constants/demoBlogs";
import { demoProduct } from "../constants/demoProduct";
import { demoProductWorkspace } from "../constants/demoProductWorkspace";
import { demoTopicDiscoveryResult } from "../constants/demoTopicDiscoveryResult";
import { demoTopics } from "../constants/demoTopics";
import { defaultBlogGenerationSettings } from "../constants/defaultBlogGenerationSettings";
import { emptyProduct } from "../constants/emptyProduct";
import { workspaceListPageSize } from "../constants/workspaceListPageSize";
import { useCursorPagination } from "./useCursorPagination";
import { buildInitialProductLink } from "../mappers/buildInitialProductLink";
import { buildProductWorkspaceName } from "../mappers/buildProductWorkspaceName";
import { buildExistingTopicBriefNotes } from "../utils/buildExistingTopicBriefNotes";
import { filterActiveLinks } from "../utils/filterActiveLinks";
import { filterBlogsBySearch } from "../utils/filterBlogsBySearch";
import { filterBlogsByStatus } from "../utils/filterBlogsByStatus";
import { filterBlogsByTopic } from "../utils/filterBlogsByTopic";
import { filterTopicsBySearch } from "../utils/filterTopicsBySearch";
import { filterTopicsByStatus } from "../utils/filterTopicsByStatus";
import { getUniqueBlogTopics } from "../utils/getUniqueBlogTopics";
import { countPublishedBlogs } from "../utils/countPublishedBlogs";
import { countWorkspaceImages } from "../utils/countWorkspaceImages";
import { setProductLinkActiveState } from "../utils/setProductLinkActiveState";
import type { BlogItem } from "../types/BlogItem";
import type { BlogGenerationSettings } from "../types/BlogGenerationSettings";
import type { BlogListViewState } from "../types/BlogListViewState";
import type { BlogStatusFilter } from "../types/BlogStatusFilter";
import type { CreateProductWorkspaceInput } from "../types/CreateProductWorkspaceInput";
import type { ProductProfile } from "../types/ProductProfile";
import type { ProductWorkspace } from "../types/ProductWorkspace";
import type { TopicItem } from "../types/TopicItem";
import type { TopicListViewState } from "../types/TopicListViewState";
import type { TopicStatusFilter } from "../types/TopicStatusFilter";
import type { WriteBlogOptions } from "../types/WriteBlogOptions";
import type { WorkspaceSummary } from "../types/WorkspaceSummary";
import type { WorkspaceViewMode } from "../types/WorkspaceViewMode";
import type { BlogPublishingIntegrationDraft } from "../types/integrations/BlogPublishingIntegrationDraft";

export const useDemoWorkspace = (initialMode: WorkspaceViewMode) => {
  const [mode, setMode] = useState<WorkspaceViewMode>(initialMode);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState(
    demoProductWorkspace.id,
  );
  const [workspaces, setWorkspaces] = useState<ProductWorkspace[]>([
    demoProductWorkspace,
  ]);
  const [productsByWorkspace, setProductsByWorkspace] = useState<
    Record<string, ProductProfile>
  >({
    [demoProductWorkspace.id]: demoProduct,
  });
  const [productScanMessage, setProductScanMessage] = useState("");
  const [isScanningProduct, setIsScanningProduct] = useState(false);
  const [productLinksMessage, setProductLinksMessage] = useState("");
  const [topicsByWorkspace, setTopicsByWorkspace] = useState<
    Record<string, TopicItem[]>
  >({
    [demoProductWorkspace.id]: demoTopics,
  });
  const [blogsByWorkspace, setBlogsByWorkspace] = useState<
    Record<string, BlogItem[]>
  >({
    [demoProductWorkspace.id]: demoBlogs,
  });
  const [settingsByWorkspace, setSettingsByWorkspace] = useState<
    Record<string, BlogGenerationSettings>
  >({
    [demoProductWorkspace.id]: defaultBlogGenerationSettings,
  });
  const [settingsStatusMessage, setSettingsStatusMessage] = useState("");
  const [
    publishingIntegrationStatusMessage,
    setPublishingIntegrationStatusMessage,
  ] = useState("");
  const [selectedBlogId, setSelectedBlogId] = useState(demoBlogs[0]?.id ?? "");
  const [topicStatusFilter, setTopicStatusFilter] =
    useState<TopicStatusFilter>("saved");
  const [topicSearchQuery, setTopicSearchQuery] = useState("");
  const [blogStatusFilter, setBlogStatusFilter] =
    useState<BlogStatusFilter>("unpublished");
  const [blogSearchQuery, setBlogSearchQuery] = useState("");
  const [blogTopicFilter, setBlogTopicFilter] = useState("all");
  const {
    canGoPrevious: canGoToPreviousTopicPage,
    goToNextPage: goToNextTopicPage,
    goToPreviousPage: goToPreviousTopicPage,
    pageNumber: topicPageNumber,
    resetPagination: resetTopicPagination,
  } = useCursorPagination();
  const {
    canGoPrevious: canGoToPreviousBlogPage,
    goToNextPage: goToNextBlogPage,
    goToPreviousPage: goToPreviousBlogPage,
    pageNumber: blogPageNumber,
    resetPagination: resetBlogPagination,
  } = useCursorPagination();
  const product = productsByWorkspace[activeWorkspaceId] || emptyProduct;
  const blogGenerationSettings =
    settingsByWorkspace[activeWorkspaceId] || defaultBlogGenerationSettings;
  const workspaceTopics = useMemo(
    () => topicsByWorkspace[activeWorkspaceId] || [],
    [activeWorkspaceId, topicsByWorkspace],
  );
  const workspaceBlogs = useMemo(
    () => blogsByWorkspace[activeWorkspaceId] || [],
    [activeWorkspaceId, blogsByWorkspace],
  );
  const filteredTopics = useMemo(
    () =>
      filterTopicsBySearch(
        filterTopicsByStatus(workspaceTopics, topicStatusFilter),
        topicSearchQuery,
      ),
    [topicSearchQuery, topicStatusFilter, workspaceTopics],
  );
  const filteredBlogs = useMemo(
    () =>
      filterBlogsBySearch(
        filterBlogsByTopic(
          filterBlogsByStatus(workspaceBlogs, blogStatusFilter),
          blogTopicFilter,
        ),
        blogSearchQuery,
      ),
    [blogSearchQuery, blogStatusFilter, blogTopicFilter, workspaceBlogs],
  );
  const topicPageStart = (topicPageNumber - 1) * workspaceListPageSize;
  const blogPageStart = (blogPageNumber - 1) * workspaceListPageSize;
  const topics = useMemo(
    () =>
      filteredTopics.slice(
        topicPageStart,
        topicPageStart + workspaceListPageSize,
      ),
    [filteredTopics, topicPageStart],
  );
  const blogs = useMemo(
    () =>
      filteredBlogs.slice(blogPageStart, blogPageStart + workspaceListPageSize),
    [blogPageStart, filteredBlogs],
  );
  const blogTopicOptions = useMemo(
    () => [
      { label: "All topics", value: "all" },
      ...getUniqueBlogTopics(workspaceBlogs).map((topic) => ({
        label: topic,
        value: topic,
      })),
    ],
    [workspaceBlogs],
  );
  const workspaceSummary: WorkspaceSummary = useMemo(
    () => ({
      blogCount: workspaceBlogs.length,
      imageCount: countWorkspaceImages(workspaceBlogs),
      publishedBlogCount: countPublishedBlogs(workspaceBlogs),
      recentBlogs: workspaceBlogs.slice(0, 5),
      topicCount: workspaceTopics.length,
    }),
    [workspaceBlogs, workspaceTopics],
  );
  const topicListState: TopicListViewState = useMemo(
    () => ({
      activeFilter: topicStatusFilter,
      pagination: {
        canGoNext:
          topicPageStart + workspaceListPageSize < filteredTopics.length,
        canGoPrevious: canGoToPreviousTopicPage,
        goToNextPage: () => {
          goToNextTopicPage(String(topicPageStart));
        },
        goToPreviousPage: goToPreviousTopicPage,
        isLoading: false,
        pageNumber: topicPageNumber,
      },
      searchQuery: topicSearchQuery,
      setActiveFilter: setTopicStatusFilter,
      setSearchQuery: setTopicSearchQuery,
    }),
    [
      filteredTopics.length,
      canGoToPreviousTopicPage,
      goToNextTopicPage,
      goToPreviousTopicPage,
      topicPageNumber,
      topicPageStart,
      topicSearchQuery,
      topicStatusFilter,
    ],
  );
  const blogListState: BlogListViewState = useMemo(
    () => ({
      activeFilter: blogStatusFilter,
      pagination: {
        canGoNext: blogPageStart + workspaceListPageSize < filteredBlogs.length,
        canGoPrevious: canGoToPreviousBlogPage,
        goToNextPage: () => {
          goToNextBlogPage(String(blogPageStart));
        },
        goToPreviousPage: goToPreviousBlogPage,
        isLoading: false,
        pageNumber: blogPageNumber,
      },
      searchQuery: blogSearchQuery,
      setActiveFilter: setBlogStatusFilter,
      setSearchQuery: setBlogSearchQuery,
      setTopicFilter: setBlogTopicFilter,
      topicFilter: blogTopicFilter,
      topicOptions: blogTopicOptions,
    }),
    [
      blogPageNumber,
      blogPageStart,
      blogSearchQuery,
      blogStatusFilter,
      blogTopicFilter,
      blogTopicOptions,
      canGoToPreviousBlogPage,
      filteredBlogs.length,
      goToNextBlogPage,
      goToPreviousBlogPage,
    ],
  );
  const activeWorkspace = workspaces.find(
    (workspace) => workspace.id === activeWorkspaceId,
  );

  useEffect(() => {
    resetTopicPagination();
  }, [
    activeWorkspaceId,
    resetTopicPagination,
    topicSearchQuery,
    topicStatusFilter,
  ]);

  useEffect(() => {
    resetBlogPagination();
  }, [
    activeWorkspaceId,
    blogSearchQuery,
    blogStatusFilter,
    blogTopicFilter,
    resetBlogPagination,
  ]);

  const selectedBlog = useMemo(
    () => blogs.find((blog) => blog.id === selectedBlogId) ?? blogs[0],
    [blogs, selectedBlogId],
  );

  const scanProduct = (websiteUrl: string, niche: string) => {
    setIsScanningProduct(true);
    setProductsByWorkspace((current) => {
      const nextProduct = {
        ...(current[activeWorkspaceId] || emptyProduct),
        websiteUrl,
        niche,
      };

      setWorkspaces((workspaceItems) =>
        workspaceItems.map((workspace) =>
          workspace.id === activeWorkspaceId
            ? {
                ...workspace,
                name: buildProductWorkspaceName(nextProduct),
                niche,
                updatedAt: Date.now(),
                websiteUrl,
              }
            : workspace,
        ),
      );

      return {
        ...current,
        [activeWorkspaceId]: nextProduct,
      };
    });
    setProductScanMessage("Saved in preview.");
    setIsScanningProduct(false);
  };

  const refreshProductLinks = () => {
    setProductsByWorkspace((current) => {
      const product = current[activeWorkspaceId] || emptyProduct;
      const siteLinks =
        product.siteLinks.length > 0
          ? product.siteLinks
          : product.websiteUrl
            ? [buildInitialProductLink(product.websiteUrl)]
            : [];

      return {
        ...current,
        [activeWorkspaceId]: {
          ...product,
          siteLinks,
        },
      };
    });
    setProductLinksMessage("Links refreshed in preview.");
  };

  const setProductLinkActive = (url: string, isActive: boolean) => {
    setProductsByWorkspace((current) => {
      const product = current[activeWorkspaceId] || emptyProduct;

      return {
        ...current,
        [activeWorkspaceId]: {
          ...product,
          siteLinks: setProductLinkActiveState({
            isActive,
            links: product.siteLinks,
            url,
          }),
        },
      };
    });
    setProductLinksMessage(
      isActive ? "Link turned back on in preview." : "Link paused in preview.",
    );
  };

  const addTopic = (keyword: string, notes?: string) => {
    const trimmed = keyword.trim();
    if (!trimmed) return;

    const topicId = `topic-${Date.now()}-${Math.random()
      .toString(16)
      .slice(2)}`;

    setTopicsByWorkspace((current) => ({
      ...current,
      [activeWorkspaceId]: [
        {
          id: topicId,
          keyword: trimmed,
          notes,
          status: "saved",
        },
        ...(current[activeWorkspaceId] || []),
      ],
    }));
    resetTopicPagination();
  };

  const discoverTopicIdeas = async () => {
    return demoTopicDiscoveryResult;
  };

  const refreshTopicBrief = async (topicId: string) => {
    const topic = topics.find((item) => item.id === topicId);

    if (!topic) {
      throw new Error("Topic not found.");
    }

    const notes = buildExistingTopicBriefNotes(topic, demoTopicDiscoveryResult);

    setTopicsByWorkspace((current) => ({
      ...current,
      [activeWorkspaceId]: (current[activeWorkspaceId] || []).map((item) =>
        item.id === topicId ? { ...item, notes } : item,
      ),
    }));

    return notes;
  };

  const deleteTopic = (topicId: string) => {
    setTopicsByWorkspace((current) => ({
      ...current,
      [activeWorkspaceId]: (current[activeWorkspaceId] || []).filter(
        (topic) => topic.id !== topicId,
      ),
    }));
    setBlogsByWorkspace((current) => ({
      ...current,
      [activeWorkspaceId]: (current[activeWorkspaceId] || []).map((blog) =>
        topics.find((topic) => topic.id === topicId)?.blogId === blog.id
          ? { ...blog, updatedAt: Date.now() }
          : blog,
      ),
    }));
    resetTopicPagination();
  };

  const discoverBlogRefreshIdeas = async () => {
    return demoTopicDiscoveryResult;
  };

  const writeBlog = (topicId: string, options?: WriteBlogOptions) => {
    const topic = topics.find((item) => item.id === topicId);
    if (!topic) return;

    const sourceText = options?.sourceText?.trim();
    const blogId = `blog-${Date.now()}`;
    const title = `A Simple Guide to ${topic.keyword}`;
    const seoTitle = `A Simple Guide to ${topic.keyword} With Practical Steps, Examples, and Common Mistakes`;
    const nextBlog: BlogItem = {
      id: blogId,
      keyword: topic.keyword,
      title,
      seoTitle,
      slug: topic.keyword.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      excerpt: `A clear, friendly draft about ${topic.keyword}, with practical steps, useful examples, and simple next actions for readers.`,
      tags: [topic.keyword, "practical guide", "content planning"],
      status: "ready",
      mdx: sourceText
        ? `# ${title}\n\nThis preview draft will use your pasted source as a starting point in the live AI workflow. Add your keys, scan your site, and the app will turn it into a fresh post for this product.\n\n## Source preview\n\n${sourceText.slice(
            0,
            700,
          )}`
        : `# ${title}\n\nThis draft is ready for the live AI workflow. Add your keys, scan your site, and the app will replace this with the full researched post.`,
      images: [],
      updatedAt: Date.now(),
      internalLinks: filterActiveLinks(product.siteLinks).slice(
        0,
        blogGenerationSettings.internalLinksPerArticle,
      ),
      youtubeVideos: [],
      sources: [],
    };

    setBlogsByWorkspace((current) => ({
      ...current,
      [activeWorkspaceId]: [nextBlog, ...(current[activeWorkspaceId] || [])],
    }));
    setTopicsByWorkspace((current) => ({
      ...current,
      [activeWorkspaceId]: (current[activeWorkspaceId] || []).map((item) =>
        item.id === topicId ? { ...item, status: "written", blogId } : item,
      ),
    }));
    setSelectedBlogId(blogId);
    resetBlogPagination();
    setMode("blogs");
  };

  const deleteBlog = (blogId: string) => {
    setBlogsByWorkspace((current) => ({
      ...current,
      [activeWorkspaceId]: (current[activeWorkspaceId] || []).filter(
        (blog) => blog.id !== blogId,
      ),
    }));
    setTopicsByWorkspace((current) => ({
      ...current,
      [activeWorkspaceId]: (current[activeWorkspaceId] || []).map((topic) =>
        topic.blogId === blogId
          ? {
              ...topic,
              blogId: undefined,
              status: "saved",
            }
          : topic,
      ),
    }));

    if (selectedBlogId === blogId) {
      setSelectedBlogId("");
    }

    resetBlogPagination();
  };

  const saveBlogGenerationSettings = (settings: BlogGenerationSettings) => {
    setSettingsByWorkspace((current) => ({
      ...current,
      [activeWorkspaceId]: settings,
    }));
    setSettingsStatusMessage("Settings saved in preview.");
  };

  const saveBlogPublishingIntegration = (
    integration: BlogPublishingIntegrationDraft,
  ) => {
    setProductsByWorkspace((current) => {
      const product = current[activeWorkspaceId] || emptyProduct;

      return {
        ...current,
        [activeWorkspaceId]: {
          ...product,
          blogPublishingIntegration: {
            enabled: integration.enabled,
            hasAccessToken:
              integration.enabled &&
              Boolean(
                integration.accessToken ||
                  product.blogPublishingIntegration?.hasAccessToken,
              ),
            sourceName: integration.sourceName.trim() || "Blogr",
            updatedAt: Date.now(),
            webhookUrl: integration.enabled ? integration.webhookUrl.trim() : "",
          },
        },
      };
    });
    setPublishingIntegrationStatusMessage(
      integration.enabled
        ? "Publishing connected in preview."
        : "Publishing removed in preview.",
    );
  };

  const selectWorkspace = async (workspaceId: string) => {
    if (!workspaces.some((workspace) => workspace.id === workspaceId)) {
      return;
    }

    setActiveWorkspaceId(workspaceId);
    setSelectedBlogId("");
    setSettingsStatusMessage("");
  };

  const createWorkspace = async (input: CreateProductWorkspaceInput) => {
    const name = input.name.trim() || "New workspace";
    const websiteUrl = input.websiteUrl?.trim() || "";
    const niche = input.niche?.trim() || "";
    const workspaceId = `workspace-${Date.now()}`;
    const nextProduct: ProductProfile = {
      ...emptyProduct,
      name,
      websiteUrl,
      niche,
      description: "Add a site to fill in this workspace.",
    };
    const nextWorkspace: ProductWorkspace = {
      id: workspaceId,
      name,
      niche,
      updatedAt: Date.now(),
      websiteUrl,
    };

    setWorkspaces((current) => [nextWorkspace, ...current]);
    setProductsByWorkspace((current) => ({
      ...current,
      [workspaceId]: nextProduct,
    }));
    setTopicsByWorkspace((current) => ({
      ...current,
      [workspaceId]: [],
    }));
    setBlogsByWorkspace((current) => ({
      ...current,
      [workspaceId]: [],
    }));
    setSettingsByWorkspace((current) => ({
      ...current,
      [workspaceId]: defaultBlogGenerationSettings,
    }));
    setActiveWorkspaceId(workspaceId);
    setSelectedBlogId("");
    setSettingsStatusMessage("");

    return workspaceId;
  };

  return {
    mode,
    setMode,
    blogGenerationSettings,
    blogListState,
    isSavingBlogPublishingIntegration: false,
    isSavingBlogGenerationSettings: false,
    product,
    productLinksState: {
      isRefreshing: false,
      message: productLinksMessage,
    },
    publishingIntegrationStatusMessage,
    productScanState: {
      isScanning: isScanningProduct,
      message: productScanMessage,
    },
    topics,
    topicListState,
    blogs,
    workspaceSummary,
    selectedBlog,
    selectedBlogId,
    settingsStatusMessage,
    setSelectedBlogId,
    scanProduct,
    addTopic,
    discoverBlogRefreshIdeas,
    discoverTopicIdeas,
    deleteBlog,
    deleteTopic,
    refreshTopicBrief,
    refreshProductLinks,
    saveBlogGenerationSettings,
    saveBlogPublishingIntegration,
    setProductLinkActive,
    workspaceSwitcher: {
      activeWorkspace,
      activeWorkspaceId,
      createWorkspace,
      isLoadingWorkspaces: false,
      selectWorkspace,
      workspaces,
    },
    writeBlog,
  };
};
