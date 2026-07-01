"use client";

import { useState } from "react";
import { BlogPreviewSidebar } from "./BlogPreviewSidebar";
import { BlogPublishingIntegrationPanel } from "./BlogPublishingIntegrationPanel";
import { BlogsPanel } from "./BlogsPanel";
import { CalendarPanel } from "./CalendarPanel";
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
import type { AddScheduledTopic } from "../types/AddScheduledTopic";
import type { CalendarState } from "../types/CalendarState";
import type { DeleteBlog } from "../types/DeleteBlog";
import type { DeleteTopic } from "../types/DeleteTopic";
import type { DiscoverBlogRefreshIdeas } from "../types/DiscoverBlogRefreshIdeas";
import type { FillCalendarBlankDays } from "../types/FillCalendarBlankDays";
import type { ProductProfile } from "../types/ProductProfile";
import type { ProductLinksState } from "../types/ProductLinksState";
import type { ProductScanState } from "../types/ProductScanState";
import type { RefreshProductLinks } from "../types/RefreshProductLinks";
import type { RefreshTopicBrief } from "../types/RefreshTopicBrief";
import type { RemoveTopicFromCalendar } from "../types/RemoveTopicFromCalendar";
import type { SaveTopicBrief } from "../types/SaveTopicBrief";
import type { RegenerateBlogImage } from "../types/RegenerateBlogImage";
import type { ScheduleTopicOnCalendar } from "../types/ScheduleTopicOnCalendar";
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
  addScheduledTopic: AddScheduledTopic;
  addTopic: (keyword: string, notes?: string) => void | Promise<void>;
  blogGenerationSettings: BlogGenerationSettings;
  blogListState: BlogListViewState;
  blogs: BlogItem[];
  calendarState: CalendarState;
  calendarTopics: TopicItem[];
  deleteBlog: DeleteBlog;
  deleteTopic: DeleteTopic;
  discoverBlogRefreshIdeas: DiscoverBlogRefreshIdeas;
  discoverTopicIdeas: DiscoverTopicIdeas;
  fillCalendarBlankDays: FillCalendarBlankDays;
  isSavingBlogPublishingIntegration: boolean;
  isSavingBlogGenerationSettings: boolean;
  mode: WorkspaceViewMode;
  product: ProductProfile;
  productLinksState: ProductLinksState;
  publishingIntegrationStatusMessage: string;
  productScanState: ProductScanState;
  refreshTopicBrief: RefreshTopicBrief;
  refreshProductLinks: RefreshProductLinks;
  removeTopicFromCalendar: RemoveTopicFromCalendar;
  regenerateImage?: RegenerateBlogImage;
  saveTopicBrief: SaveTopicBrief;
  saveBlogGenerationSettings: (
    settings: BlogGenerationSettings,
  ) => void | Promise<void>;
  saveBlogPublishingIntegration: (
    integration: BlogPublishingIntegrationDraft,
  ) => void | Promise<void>;
  schedulableTopics: TopicItem[];
  scheduleTopicOnCalendar: ScheduleTopicOnCalendar;
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
  addScheduledTopic,
  addTopic,
  blogGenerationSettings,
  blogListState,
  blogs,
  calendarState,
  calendarTopics,
  deleteBlog,
  deleteTopic,
  discoverBlogRefreshIdeas,
  discoverTopicIdeas,
  fillCalendarBlankDays,
  isSavingBlogPublishingIntegration,
  isSavingBlogGenerationSettings,
  mode,
  product,
  productLinksState,
  publishingIntegrationStatusMessage,
  productScanState,
  refreshTopicBrief,
  refreshProductLinks,
  removeTopicFromCalendar,
  regenerateImage,
  saveTopicBrief,
  saveBlogGenerationSettings,
  saveBlogPublishingIntegration,
  schedulableTopics,
  scheduleTopicOnCalendar,
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

  const openBlogPreview = (blogId: string) => {
    setSelectedBlogId(blogId);
    setIsBlogPreviewOpen(true);
  };

  const deleteBlogAndClosePreview: DeleteBlog = async (blogId) => {
    await deleteBlog(blogId);
    setIsBlogPreviewOpen(false);
  };
  const occupiedCalendarDates = schedulableTopics
    .map((topic) => topic.scheduledDate)
    .filter((date): date is string => Boolean(date));

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
              previewBlog={openBlogPreview}
              summary={workspaceSummary}
              topics={topics}
            />
          ) : null}
          {mode === "topics" ? (
            <TopicsPanel
              addTopic={addTopic}
              calendarDateKeys={calendarState.dateKeys}
              deleteTopic={deleteTopic}
              discoverTopicIdeas={discoverTopicIdeas}
              listState={topicListState}
              occupiedCalendarDates={occupiedCalendarDates}
              openBlogPreview={openBlogPreview}
              refreshTopicBrief={refreshTopicBrief}
              removeTopicFromCalendar={removeTopicFromCalendar}
              saveTopicBrief={saveTopicBrief}
              scheduleTopicOnCalendar={scheduleTopicOnCalendar}
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
              previewBlog={openBlogPreview}
              selectedBlogId={selectedBlogId}
            />
          ) : null}
          {mode === "calendar" ? (
            <CalendarPanel
              addScheduledTopic={addScheduledTopic}
              calendarState={calendarState}
              deleteTopic={deleteTopic}
              fillCalendarBlankDays={fillCalendarBlankDays}
              openBlogPreview={openBlogPreview}
              refreshTopicBrief={refreshTopicBrief}
              removeTopicFromCalendar={removeTopicFromCalendar}
              saveTopicBrief={saveTopicBrief}
              savedTopics={schedulableTopics}
              scheduleTopicOnCalendar={scheduleTopicOnCalendar}
              topics={calendarTopics}
              writeBlog={writeBlog}
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
        {mode === "dashboard" ||
        mode === "blogs" ||
        mode === "calendar" ||
        mode === "topics" ? (
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
