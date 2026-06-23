"use client";

import { useMemo, useState } from "react";
import { demoBlogs } from "../constants/demoBlogs";
import { demoProduct } from "../constants/demoProduct";
import { demoProductWorkspace } from "../constants/demoProductWorkspace";
import { demoTopicDiscoveryResult } from "../constants/demoTopicDiscoveryResult";
import { demoTopics } from "../constants/demoTopics";
import { defaultBlogGenerationSettings } from "../constants/defaultBlogGenerationSettings";
import { emptyProduct } from "../constants/emptyProduct";
import { buildProductWorkspaceName } from "../mappers/buildProductWorkspaceName";
import { buildExistingTopicBriefNotes } from "../utils/buildExistingTopicBriefNotes";
import type { BlogItem } from "../types/BlogItem";
import type { BlogGenerationSettings } from "../types/BlogGenerationSettings";
import type { CreateProductWorkspaceInput } from "../types/CreateProductWorkspaceInput";
import type { ProductProfile } from "../types/ProductProfile";
import type { ProductWorkspace } from "../types/ProductWorkspace";
import type { TopicItem } from "../types/TopicItem";
import type { WriteBlogOptions } from "../types/WriteBlogOptions";
import type { WorkspaceViewMode } from "../types/WorkspaceViewMode";

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
  const [selectedBlogId, setSelectedBlogId] = useState(demoBlogs[0]?.id ?? "");
  const product = productsByWorkspace[activeWorkspaceId] || emptyProduct;
  const blogGenerationSettings =
    settingsByWorkspace[activeWorkspaceId] || defaultBlogGenerationSettings;
  const topics = useMemo(
    () => topicsByWorkspace[activeWorkspaceId] || [],
    [activeWorkspaceId, topicsByWorkspace],
  );
  const blogs = useMemo(
    () => blogsByWorkspace[activeWorkspaceId] || [],
    [activeWorkspaceId, blogsByWorkspace],
  );
  const activeWorkspace = workspaces.find(
    (workspace) => workspace.id === activeWorkspaceId,
  );

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

  const discoverBlogRefreshIdeas = async () => {
    return demoTopicDiscoveryResult;
  };

  const writeBlog = (topicId: string, options?: WriteBlogOptions) => {
    const topic = topics.find((item) => item.id === topicId);
    if (!topic) return;

    const sourceText = options?.sourceText?.trim();
    const blogId = `blog-${Date.now()}`;
    const title = `A Simple Guide to ${topic.keyword}`;
    const nextBlog: BlogItem = {
      id: blogId,
      keyword: topic.keyword,
      title,
      slug: topic.keyword.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      excerpt: `A clear, friendly draft about ${topic.keyword}.`,
      status: "ready",
      mdx: sourceText
        ? `# ${title}\n\nThis preview draft will use your pasted source as a starting point in the live AI workflow. Add your keys, scan your site, and the app will turn it into a fresh post for this product.\n\n## Source preview\n\n${sourceText.slice(
            0,
            700,
          )}`
        : `# ${title}\n\nThis draft is ready for the live AI workflow. Add your keys, scan your site, and the app will replace this with the full researched post.`,
      images: [],
      updatedAt: Date.now(),
      internalLinks: product.siteLinks.slice(
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
    setMode("blogs");
  };

  const saveBlogGenerationSettings = (settings: BlogGenerationSettings) => {
    setSettingsByWorkspace((current) => ({
      ...current,
      [activeWorkspaceId]: settings,
    }));
    setSettingsStatusMessage("Settings saved in preview.");
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
    isSavingBlogGenerationSettings: false,
    product,
    productScanState: {
      isScanning: isScanningProduct,
      message: productScanMessage,
    },
    topics,
    blogs,
    selectedBlog,
    selectedBlogId,
    settingsStatusMessage,
    setSelectedBlogId,
    scanProduct,
    addTopic,
    discoverBlogRefreshIdeas,
    discoverTopicIdeas,
    refreshTopicBrief,
    saveBlogGenerationSettings,
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
