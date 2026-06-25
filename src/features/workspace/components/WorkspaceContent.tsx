"use client";

import { BlogPublishingIntegrationPanel } from "./BlogPublishingIntegrationPanel";
import { BlogsPanel } from "./BlogsPanel";
import { DashboardPanel } from "./DashboardPanel";
import { ProductSetupPanel } from "./ProductSetupPanel";
import { TopicsPanel } from "./TopicsPanel";
import { WorkspaceSettingsPanel } from "./WorkspaceSettingsPanel";
import { WorkspacePageHeader } from "./WorkspacePageHeader";
import { WorkspaceShell } from "./WorkspaceShell";
import type { BlogItem } from "../types/BlogItem";
import type { BlogGenerationSettings } from "../types/BlogGenerationSettings";
import type { DiscoverBlogRefreshIdeas } from "../types/DiscoverBlogRefreshIdeas";
import type { ProductProfile } from "../types/ProductProfile";
import type { ProductScanState } from "../types/ProductScanState";
import type { RefreshTopicBrief } from "../types/RefreshTopicBrief";
import type { TopicItem } from "../types/TopicItem";
import type { WriteBlogOptions } from "../types/WriteBlogOptions";
import type { WorkspaceSwitcherState } from "../types/WorkspaceSwitcherState";
import type { WorkspaceViewMode } from "../types/WorkspaceViewMode";
import type { BlogPublishingIntegrationDraft } from "../types/integrations/BlogPublishingIntegrationDraft";
import type { DiscoverTopicIdeas } from "../types/topicDiscovery/DiscoverTopicIdeas";

type WorkspaceContentProps = {
  addTopic: (keyword: string, notes?: string) => void | Promise<void>;
  blogGenerationSettings: BlogGenerationSettings;
  blogs: BlogItem[];
  deleteBlog: (blogId: string) => void | Promise<void>;
  deleteTopic: (topicId: string) => void | Promise<void>;
  discoverBlogRefreshIdeas: DiscoverBlogRefreshIdeas;
  discoverTopicIdeas: DiscoverTopicIdeas;
  isSavingBlogPublishingIntegration: boolean;
  isSavingBlogGenerationSettings: boolean;
  mode: WorkspaceViewMode;
  product: ProductProfile;
  publishingIntegrationStatusMessage: string;
  productScanState: ProductScanState;
  refreshTopicBrief: RefreshTopicBrief;
  saveBlogGenerationSettings: (
    settings: BlogGenerationSettings,
  ) => void | Promise<void>;
  saveBlogPublishingIntegration: (
    integration: BlogPublishingIntegrationDraft,
  ) => void | Promise<void>;
  scanProduct: (websiteUrl: string, niche: string) => void | Promise<void>;
  settingsStatusMessage: string;
  setMode: (mode: WorkspaceViewMode) => void;
  topics: TopicItem[];
  workspaceSwitcher: WorkspaceSwitcherState;
  writeBlog: (
    topicId: string,
    options?: WriteBlogOptions,
  ) => void | Promise<void>;
};

export const WorkspaceContent = ({
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
  publishingIntegrationStatusMessage,
  productScanState,
  refreshTopicBrief,
  saveBlogGenerationSettings,
  saveBlogPublishingIntegration,
  scanProduct,
  settingsStatusMessage,
  setMode,
  topics,
  workspaceSwitcher,
  writeBlog,
}: WorkspaceContentProps) => {
  return (
    <WorkspaceShell
      mode={mode}
      setMode={setMode}
      workspaceSwitcher={workspaceSwitcher}
    >
      <div className="grid gap-5">
        <main className="space-y-5">
          {mode === "dashboard" ? (
            <DashboardPanel blogs={blogs} topics={topics} />
          ) : null}
          {mode === "topics" ? (
            <TopicsPanel
              addTopic={addTopic}
              deleteTopic={deleteTopic}
              discoverTopicIdeas={discoverTopicIdeas}
              refreshTopicBrief={refreshTopicBrief}
              topics={topics}
              writeBlog={writeBlog}
            />
          ) : null}
          {mode === "blogs" ? (
            <BlogsPanel
              addTopic={addTopic}
              blogs={blogs}
              deleteBlog={deleteBlog}
              discoverBlogRefreshIdeas={discoverBlogRefreshIdeas}
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
      </div>
    </WorkspaceShell>
  );
};
