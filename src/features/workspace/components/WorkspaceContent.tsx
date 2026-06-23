"use client";

import { BlogPreviewPanel } from "./BlogPreviewPanel";
import { BlogPublishingIntegrationPanel } from "./BlogPublishingIntegrationPanel";
import { BlogsPanel } from "./BlogsPanel";
import { ProductSetupPanel } from "./ProductSetupPanel";
import { TopicsPanel } from "./TopicsPanel";
import { WorkspaceSettingsPanel } from "./WorkspaceSettingsPanel";
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
  selectedBlog?: BlogItem;
  selectedBlogId: string;
  settingsStatusMessage: string;
  setMode: (mode: WorkspaceViewMode) => void;
  setSelectedBlogId: (blogId: string) => void;
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
  selectedBlog,
  selectedBlogId,
  settingsStatusMessage,
  setMode,
  setSelectedBlogId,
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
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
        <main className="space-y-5">
          <ProductSetupPanel
            key={`${product.websiteUrl}:${product.niche}`}
            product={product}
            productScanState={productScanState}
            scanProduct={scanProduct}
          />
          {mode === "topics" ? (
            <TopicsPanel
              addTopic={addTopic}
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
              discoverBlogRefreshIdeas={discoverBlogRefreshIdeas}
              selectedBlogId={selectedBlogId}
              setSelectedBlogId={setSelectedBlogId}
            />
          ) : null}
          {mode === "settings" ? (
            <div className="space-y-5">
              <BlogPublishingIntegrationPanel
                integration={product.blogPublishingIntegration}
                isSaving={isSavingBlogPublishingIntegration}
                key={`${workspaceSwitcher.activeWorkspaceId}:${JSON.stringify(
                  product.blogPublishingIntegration,
                )}`}
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
        <BlogPreviewPanel blog={selectedBlog} />
      </div>
    </WorkspaceShell>
  );
};
