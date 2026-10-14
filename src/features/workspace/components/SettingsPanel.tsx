"use client";

import { BlogPublishingIntegrationPanel } from "./BlogPublishingIntegrationPanel";
import { CalendarQueueSettingsPanel } from "./CalendarQueueSettingsPanel";
import { LocalBackupPanel } from "./LocalBackupPanel";
import { ProductDetailsPanel } from "./ProductDetailsPanel";
import { ProductLinksPanel } from "./ProductLinksPanel";
import { ProductSetupPanel } from "./ProductSetupPanel";
import { SettingsOverview } from "./SettingsOverview";
import { SettingsSectionNav } from "./SettingsSectionNav";
import { WorkspacePageHeader } from "./WorkspacePageHeader";
import { WorkspaceSettingsPanel } from "./WorkspaceSettingsPanel";
import { settingsSections } from "../constants/settingsSections";
import { useSettingsSection } from "../hooks/useSettingsSection";
import type { BlogGenerationSettings } from "../types/BlogGenerationSettings";
import type { CalendarState } from "../types/CalendarState";
import type { ProductDetailsState } from "../types/ProductDetailsState";
import type { ProductLinksState } from "../types/ProductLinksState";
import type { ProductProfile } from "../types/ProductProfile";
import type { ProductScanState } from "../types/ProductScanState";
import type { RefreshProductLinks } from "../types/RefreshProductLinks";
import type { SaveCalendarQueueSettings } from "../types/SaveCalendarQueueSettings";
import type { SaveProductDetails } from "../types/SaveProductDetails";
import type { SetProductLinkActive } from "../types/SetProductLinkActive";
import type { SettingsSectionId } from "../types/SettingsSectionId";
import type { BlogPublishingIntegrationDraft } from "../types/integrations/BlogPublishingIntegrationDraft";

type SettingsPanelProps = {
  blogGenerationSettings: BlogGenerationSettings;
  calendarState: CalendarState;
  isSavingBlogGenerationSettings: boolean;
  isSavingBlogPublishingIntegration: boolean;
  product: ProductProfile;
  productDetailsState: ProductDetailsState;
  productLinksState: ProductLinksState;
  productScanState: ProductScanState;
  publishingIntegrationStatusMessage: string;
  refreshProductLinks: RefreshProductLinks;
  saveBlogGenerationSettings: (
    settings: BlogGenerationSettings,
    expectedUpdatedAt: number,
  ) => void | Promise<void>;
  saveBlogPublishingIntegration: (
    integration: BlogPublishingIntegrationDraft,
    expectedUpdatedAt: number,
  ) => void | Promise<void>;
  saveCalendarQueueSettings: SaveCalendarQueueSettings;
  saveProductDetails: SaveProductDetails;
  scanProduct: (websiteUrl: string, niche: string) => void | Promise<void>;
  setProductLinkActive: SetProductLinkActive;
  settingsStatusMessage: string;
  workspaceId: string;
};

export const SettingsPanel = ({
  blogGenerationSettings,
  calendarState,
  isSavingBlogGenerationSettings,
  isSavingBlogPublishingIntegration,
  product,
  productDetailsState,
  productLinksState,
  productScanState,
  publishingIntegrationStatusMessage,
  refreshProductLinks,
  saveBlogGenerationSettings,
  saveBlogPublishingIntegration,
  saveCalendarQueueSettings,
  saveProductDetails,
  scanProduct,
  setProductLinkActive,
  settingsStatusMessage,
  workspaceId,
}: SettingsPanelProps) => {
  const { activeSection, selectSection } = useSettingsSection();
  const activeSectionDetails = settingsSections.find(
    (section) => section.id === activeSection,
  );
  // Hidden sections stay mounted so unsaved edits survive switching sections.
  const isHidden = (sectionId: SettingsSectionId) => activeSection !== sectionId;

  return (
    <div className="space-y-5">
      <WorkspacePageHeader
        description="Set up your product, writing, publishing, and calendar."
        title="Settings"
      />
      <div className="grid gap-5 lg:grid-cols-[12rem_minmax(0,1fr)] lg:items-start">
        <SettingsSectionNav
          activeSection={activeSection}
          onSelect={selectSection}
        />
        <div className="grid min-w-0 gap-5">
          {activeSectionDetails ? (
            <div>
              <h2 className="text-xl font-semibold text-black">
                {activeSectionDetails.label}
              </h2>
              <p className="mt-1 text-sm leading-6 text-black/60">
                {activeSectionDetails.description}
              </p>
            </div>
          ) : null}
          <div hidden={isHidden("overview")}>
            <SettingsOverview
              calendarQueueSettings={calendarState.calendarQueueSettings}
              onSelect={selectSection}
              product={product}
              writingSettings={blogGenerationSettings}
            />
          </div>
          <div className="space-y-5" hidden={isHidden("product")}>
            <ProductSetupPanel
              key={`product-setup-${workspaceId}`}
              product={product}
              productScanState={productScanState}
              scanProduct={scanProduct}
            />
            <ProductDetailsPanel
              key={`product-details-${workspaceId}`}
              product={product}
              productDetailsState={productDetailsState}
              saveProductDetails={saveProductDetails}
            />
          </div>
          <div hidden={isHidden("writing")}>
            <WorkspaceSettingsPanel
              isSaving={isSavingBlogGenerationSettings}
              key={`article-settings-${workspaceId}`}
              productUpdatedAt={product.updatedAt || 0}
              saveSettings={saveBlogGenerationSettings}
              settings={blogGenerationSettings}
              statusMessage={settingsStatusMessage}
            />
          </div>
          <div hidden={isHidden("links")}>
            <ProductLinksPanel
              links={product.siteLinks}
              productLinksState={productLinksState}
              refreshProductLinks={refreshProductLinks}
              setProductLinkActive={setProductLinkActive}
            />
          </div>
          <div hidden={isHidden("publishing")}>
            <BlogPublishingIntegrationPanel
              integration={product.blogPublishingIntegration}
              isSaving={isSavingBlogPublishingIntegration}
              key={`blog-publishing-${workspaceId}`}
              productName={product.name}
              productUpdatedAt={product.updatedAt || 0}
              saveIntegration={saveBlogPublishingIntegration}
              statusMessage={publishingIntegrationStatusMessage}
            />
          </div>
          <div hidden={isHidden("calendar")}>
            <CalendarQueueSettingsPanel
              candidateDateKeys={calendarState.fillableDateKeys}
              isSaving={calendarState.isSavingQueueSettings}
              key={`calendar-queue-${workspaceId}`}
              productUpdatedAt={product.updatedAt || 0}
              saveCalendarQueueSettings={saveCalendarQueueSettings}
              settings={calendarState.calendarQueueSettings}
              stableSeed={workspaceId}
            />
          </div>
          <div hidden={isHidden("backups")}>
            <LocalBackupPanel />
          </div>
        </div>
      </div>
    </div>
  );
};
