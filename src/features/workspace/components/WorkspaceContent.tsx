"use client";

import { useState } from "react";
import { BlogPreviewSidebar } from "./BlogPreviewSidebar";
import { BlogPublishingIntegrationPanel } from "./BlogPublishingIntegrationPanel";
import { BlogsPanel } from "./BlogsPanel";
import { DashboardPanel } from "./DashboardPanel";
import { ProductLinksPanel } from "./ProductLinksPanel";
import { ProductSetupPanel } from "./ProductSetupPanel";
import { TopicsPanel } from "./TopicsPanel";
import { WorkspaceSettingsPanel } from "./WorkspaceSettingsPanel";
import { WorkspacePageHeader } from "./WorkspacePageHeader";
import { WorkspaceShell } from "./WorkspaceShell";
import type { BlogItem } from "../types/BlogItem";
import type { BlogGenerationSettings } from "../types/BlogGenerationSettings";
import type { BlogListViewState } from "../types/BlogListViewState";
import type { DeleteBlog } from "../types/DeleteBlog";
import type { DeleteTopic } from "../types/DeleteTopic";
import type { DiscoverBlogRefreshIdeas } from "../types/DiscoverBlogRefreshIdeas";
import type { ProductProfile } from "../types/ProductProfile";
import type { ProductLinksState } from "../types/ProductLinksState";
import type { ProductScanState } from "../types/ProductScanState";
import type { RefreshProductLinks } from "../types/RefreshProductLinks";
import type { RefreshTopicBrief } from "../types/RefreshTopicBrief";
import type { RegenerateBlogImage } from "../types/RegenerateBlogImage";
import type { SetProductLinkActive } from "../types/SetProductLinkActive";
import type { TopicItem } from "../types/TopicItem";
import type { TopicListViewState } from "../types/TopicListViewState";
import type { WriteBlogOptions } from "../types/WriteBlogOptions";
import type { WorkspaceSwitcherState } from "../types/WorkspaceSwitcherState";
import type { WorkspaceSummary } from "../types/WorkspaceSummary";
import type { WorkspaceViewMode } from "../types/WorkspaceViewMode";
import type { BlogPublishingIntegrationDraft } from "../types/integrations/BlogPublishingIntegrationDraft";
import type { DiscoverTopicIdeas } from "../types/topicDiscovery/DiscoverTopicIdeas";

type WorkspaceContentProps = {
  addTopic: (keyword: string, notes?: string) => void | Promise<void>;
  blogGenerationSettings: BlogGenerationSettings;
  blogListState: BlogListViewState;
  blogs: BlogItem[];
  deleteBlog: DeleteBlog;
  deleteTopic: DeleteTopic;
  discoverBlogRefreshIdeas: DiscoverBlogRefreshIdeas;
  discoverTopicIdeas: DiscoverTopicIdeas;
  isSavingBlogPublishingIntegration: boolean;
  isSavingBlogGenerationSettings: boolean;
  mode: WorkspaceViewMode;
  product: ProductProfile;
  productLinksState: ProductLinksState;
  publishingIntegrationStatusMessage: string;
  productScanState: ProductScanState;
  refreshTopicBrief: RefreshTopicBrief;
  refreshProductLinks: RefreshProductLinks;
  regenerateImage?: RegenerateBlogImage;
  saveBlogGenerationSettings: (
    settings: BlogGenerationSettings,
  ) => void | Promise<void>;
  saveBlogPublishingIntegration: (
    integration: BlogPublishingIntegrationDraft,
  ) => void | Promise<void>;
  scanProduct: (websiteUrl: string, niche: string) => void | Promise<void>;
  selectedBlog?: BlogItem;
  selectedBlogId: string;
  settingsStatusMessage: string;
  setProductLinkActive: SetProductLinkActive;
  setMode: (mode: WorkspaceViewMode) => void;
  setSelectedBlogId: (blogId: string) => void;
  topics: TopicItem[];
  topicListState: TopicListViewState;
  workspaceSummary?: WorkspaceSummary;
  workspaceSwitcher: WorkspaceSwitcherState;
  writeBlog: (
    topicId: string,
    options?: WriteBlogOptions,
  ) => void | Promise<void>;
};

export const WorkspaceContent = ({
  addTopic,
  blogGenerationSettings,
  blogListState,
  blogs,
  deleteBlog,
  deleteTopic,
  discoverBlogRefreshIdeas,
  discoverTopicIdeas,
  isSavingBlogPublishingIntegration,
  isSavingBlogGenerationSettings,
  mode,
  product,
  productLinksState,
  publishingIntegrationStatusMessage,
  productScanState,
  refreshTopicBrief,
  refreshProductLinks,
  regenerateImage,
  saveBlogGenerationSettings,
  saveBlogPublishingIntegration,
  scanProduct,
  selectedBlog,
  selectedBlogId,
  settingsStatusMessage,
  setProductLinkActive,
  setMode,
  setSelectedBlogId,
  topics,
  topicListState,
  workspaceSummary,
  workspaceSwitcher,
  writeBlog,
}: WorkspaceContentProps) => {
  const [isBlogPreviewOpen, setIsBlogPreviewOpen] = useState(false);

  const previewBlog = (blogId: string) => {
    setSelectedBlogId(blogId);
    setIsBlogPreviewOpen(true);
  };

  const deleteBlogAndClosePreview: DeleteBlog = async (blogId) => {
    await deleteBlog(blogId);
    setIsBlogPreviewOpen(false);
  };

  return (
    <WorkspaceShell
      mode={mode}
      setMode={setMode}
      workspaceSwitcher={workspaceSwitcher}
    >
      <div className="grid gap-5">
        <main className="space-y-5">
          {mode === "dashboard" ? (
            <DashboardPanel
              blogs={blogs}
              summary={workspaceSummary}
              topics={topics}
            />
          ) : null}
          {mode === "topics" ? (
            <TopicsPanel
              addTopic={addTopic}
              deleteTopic={deleteTopic}
              discoverTopicIdeas={discoverTopicIdeas}
              listState={topicListState}
              refreshTopicBrief={refreshTopicBrief}
              topics={topics}
              writeBlog={writeBlog}
            />
          ) : null}
          {mode === "blogs" ? (
            <BlogsPanel
              addTopic={addTopic}
              blogs={blogs}
              deleteBlog={deleteBlogAndClosePreview}
              discoverBlogRefreshIdeas={discoverBlogRefreshIdeas}
              listState={blogListState}
              previewBlog={previewBlog}
              selectedBlogId={selectedBlogId}
              setSelectedBlogId={setSelectedBlogId}
            />
          ) : null}
          {mode === "settings" ? (
            <div className="space-y-5">
              <WorkspacePageHeader
                description="Set up your product, publishing, and article defaults."
                title="Settings"
              />
              <ProductSetupPanel
                key={`${product.websiteUrl}:${product.niche}`}
                product={product}
                productScanState={productScanState}
                scanProduct={scanProduct}
              />
              <ProductLinksPanel
                links={product.siteLinks}
                productLinksState={productLinksState}
                refreshProductLinks={refreshProductLinks}
                setProductLinkActive={setProductLinkActive}
              />
              <BlogPublishingIntegrationPanel
                integration={product.blogPublishingIntegration}
                isSaving={isSavingBlogPublishingIntegration}
                key={`${workspaceSwitcher.activeWorkspaceId}:${JSON.stringify(
                  product.blogPublishingIntegration,
                )}`}
                productName={product.name}
                saveIntegration={saveBlogPublishingIntegration}
                statusMessage={publishingIntegrationStatusMessage}
              />
              <WorkspaceSettingsPanel
                isSaving={isSavingBlogGenerationSettings}
                key={`${workspaceSwitcher.activeWorkspaceId}:${JSON.stringify(
                  blogGenerationSettings,
                )}`}
                saveSettings={saveBlogGenerationSettings}
                settings={blogGenerationSettings}
                statusMessage={settingsStatusMessage}
              />
            </div>
          ) : null}
        </main>
        {mode === "blogs" ? (
          <BlogPreviewSidebar
            blog={selectedBlog}
            deleteBlog={deleteBlogAndClosePreview}
            isOpen={isBlogPreviewOpen}
            onOpenChange={setIsBlogPreviewOpen}
            regenerateImage={regenerateImage}
            showTrigger={false}
          />
        ) : null}
      </div>
    </WorkspaceShell>
  );
};
