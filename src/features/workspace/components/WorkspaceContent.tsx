"use client";

import { BlogPreviewPanel } from "./BlogPreviewPanel";
import { BlogsPanel } from "./BlogsPanel";
import { ProductSetupPanel } from "./ProductSetupPanel";
import { TopicsPanel } from "./TopicsPanel";
import { WorkspaceSettingsPanel } from "./WorkspaceSettingsPanel";
import { WorkspaceShell } from "./WorkspaceShell";
import type { BlogItem } from "../types/BlogItem";
import type { BlogGenerationSettings } from "../types/BlogGenerationSettings";
import type { ProductProfile } from "../types/ProductProfile";
import type { ProductScanState } from "../types/ProductScanState";
import type { TopicItem } from "../types/TopicItem";
import type { WriteBlogOptions } from "../types/WriteBlogOptions";
import type { WorkspaceSwitcherState } from "../types/WorkspaceSwitcherState";
import type { WorkspaceViewMode } from "../types/WorkspaceViewMode";
import type { DiscoverTopicIdeas } from "../types/topicDiscovery/DiscoverTopicIdeas";

type WorkspaceContentProps = {
  addTopic: (keyword: string, notes?: string) => void | Promise<void>;
  blogGenerationSettings: BlogGenerationSettings;
  blogs: BlogItem[];
  discoverTopicIdeas: DiscoverTopicIdeas;
  isSavingBlogGenerationSettings: boolean;
  mode: WorkspaceViewMode;
  product: ProductProfile;
  productScanState: ProductScanState;
  saveBlogGenerationSettings: (
    settings: BlogGenerationSettings,
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
  discoverTopicIdeas,
  isSavingBlogGenerationSettings,
  mode,
  product,
  productScanState,
  saveBlogGenerationSettings,
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
              topics={topics}
              writeBlog={writeBlog}
            />
          ) : null}
          {mode === "blogs" ? (
            <BlogsPanel
              blogs={blogs}
              selectedBlogId={selectedBlogId}
              setSelectedBlogId={setSelectedBlogId}
            />
          ) : null}
          {mode === "settings" ? (
            <WorkspaceSettingsPanel
              isSaving={isSavingBlogGenerationSettings}
              key={`${workspaceSwitcher.activeWorkspaceId}:${JSON.stringify(
                blogGenerationSettings,
              )}`}
              saveSettings={saveBlogGenerationSettings}
              settings={blogGenerationSettings}
              statusMessage={settingsStatusMessage}
            />
          ) : null}
        </main>
        <BlogPreviewPanel blog={selectedBlog} />
      </div>
    </WorkspaceShell>
  );
};
