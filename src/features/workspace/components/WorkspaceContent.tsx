"use client";

import { useState } from "react";
import { BlogPreviewSidebar } from "./BlogPreviewSidebar";
import { BlogsPanel } from "./BlogsPanel";
import { CalendarPanel } from "./CalendarPanel";
import { DashboardPanel } from "./DashboardPanel";
import { TopicsPanel } from "./TopicsPanel";
import { SettingsPanel } from "./SettingsPanel";
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
import type { QuickFillCalendar } from "../types/QuickFillCalendar";
import type { SaveCalendarQueueSettings } from "../types/SaveCalendarQueueSettings";
import type { ProductProfile } from "../types/ProductProfile";
import type { ProductLinksState } from "../types/ProductLinksState";
import type { ProductDetailsState } from "../types/ProductDetailsState";
import type { ProductScanState } from "../types/ProductScanState";
import type { RefreshProductLinks } from "../types/RefreshProductLinks";
import type { RefreshTopicBrief } from "../types/RefreshTopicBrief";
import type { RemoveTopicFromCalendar } from "../types/RemoveTopicFromCalendar";
import type { SaveTopicBrief } from "../types/SaveTopicBrief";
import type { SaveProductDetails } from "../types/SaveProductDetails";
import type { RegenerateBlogImage } from "../types/RegenerateBlogImage";
import type { ScheduleTopicOnCalendar } from "../types/ScheduleTopicOnCalendar";
import type { SetProductLinkActive } from "../types/SetProductLinkActive";
import type { TopicItem } from "../types/TopicItem";
import type { TopicListViewState } from "../types/TopicListViewState";
import type { WriteBlogOptions } from "../types/WriteBlogOptions";
import type { UpdateBlogImages } from "../types/UpdateBlogImages";
import type { WorkspaceSwitcherState } from "../types/WorkspaceSwitcherState";
import type { WorkspaceSummary } from "../types/WorkspaceSummary";
import type { WorkspaceViewMode } from "../types/WorkspaceViewMode";
import type { BlogPublishingIntegrationDraft } from "../types/integrations/BlogPublishingIntegrationDraft";
import type { FindTopicIdeas } from "../types/FindTopicIdeas";

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
  findTopicIdeas: FindTopicIdeas;
  fillCalendarBlankDays: FillCalendarBlankDays;
  quickFillCalendar: QuickFillCalendar;
  saveCalendarQueueSettings: SaveCalendarQueueSettings;
  knownEligibleTopicCount: number;
  isSavingBlogPublishingIntegration: boolean;
  isSavingBlogGenerationSettings: boolean;
  mode: WorkspaceViewMode;
  product: ProductProfile;
  productDetailsState: ProductDetailsState;
  productLinksState: ProductLinksState;
  publishingIntegrationStatusMessage: string;
  productScanState: ProductScanState;
  refreshTopicBrief: RefreshTopicBrief;
  refreshProductLinks: RefreshProductLinks;
  removeTopicFromCalendar: RemoveTopicFromCalendar;
  regenerateImage?: RegenerateBlogImage;
  saveTopicBrief: SaveTopicBrief;
  saveProductDetails: SaveProductDetails;
  saveBlogGenerationSettings: (
    settings: BlogGenerationSettings,
    expectedUpdatedAt: number,
  ) => void | Promise<void>;
  saveBlogPublishingIntegration: (
    integration: BlogPublishingIntegrationDraft,
    expectedUpdatedAt: number,
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
  updateBlogImages: UpdateBlogImages;
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
  findTopicIdeas,
  fillCalendarBlankDays,
  quickFillCalendar,
  saveCalendarQueueSettings,
  knownEligibleTopicCount,
  isSavingBlogPublishingIntegration,
  isSavingBlogGenerationSettings,
  mode,
  product,
  productDetailsState,
  productLinksState,
  publishingIntegrationStatusMessage,
  productScanState,
  refreshTopicBrief,
  refreshProductLinks,
  removeTopicFromCalendar,
  regenerateImage,
  saveTopicBrief,
  saveProductDetails,
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
  updateBlogImages,
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
              findTopicIdeas={findTopicIdeas}
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
              quickFillCalendar={quickFillCalendar}
              knownEligibleTopicCount={knownEligibleTopicCount}
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
            <SettingsPanel
              blogGenerationSettings={blogGenerationSettings}
              calendarState={calendarState}
              isSavingBlogGenerationSettings={isSavingBlogGenerationSettings}
              isSavingBlogPublishingIntegration={
                isSavingBlogPublishingIntegration
              }
              product={product}
              productDetailsState={productDetailsState}
              productLinksState={productLinksState}
              productScanState={productScanState}
              publishingIntegrationStatusMessage={
                publishingIntegrationStatusMessage
              }
              refreshProductLinks={refreshProductLinks}
              saveBlogGenerationSettings={saveBlogGenerationSettings}
              saveBlogPublishingIntegration={saveBlogPublishingIntegration}
              saveCalendarQueueSettings={saveCalendarQueueSettings}
              saveProductDetails={saveProductDetails}
              scanProduct={scanProduct}
              setProductLinkActive={setProductLinkActive}
              settingsStatusMessage={settingsStatusMessage}
              workspaceId={workspaceSwitcher.activeWorkspaceId}
            />
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
            updateBlogImages={updateBlogImages}
          />
        ) : null}
      </div>
    </WorkspaceShell>
  );
};
