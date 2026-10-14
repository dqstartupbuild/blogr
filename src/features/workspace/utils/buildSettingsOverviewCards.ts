import { imageStyleOptions } from "../constants/imageStyleOptions";
import { imagesPerArticleOptions } from "../constants/imagesPerArticleOptions";
import { settingsToggleOptions } from "../constants/settingsToggleOptions";
import type { BlogGenerationSettings } from "../types/BlogGenerationSettings";
import type { CalendarQueueSettings } from "../types/CalendarQueueSettings";
import type { ProductProfile } from "../types/ProductProfile";
import type { SettingsOverviewRow } from "../types/SettingsOverviewRow";
import type { SettingsSectionId } from "../types/SettingsSectionId";
import { formatCalendarQueueSummary } from "./formatCalendarQueueSummary";
import { isLinkActive } from "./isLinkActive";

type SettingsOverviewCardData = {
  id: Exclude<SettingsSectionId, "overview">;
  note?: string;
  rows: SettingsOverviewRow[];
};

const countLabel = (count: number, singular: string, plural = `${singular}s`) =>
  `${count} ${count === 1 ? singular : plural}`;

const orNotSet = (value: string) => value.trim() || "Not set";

const getProductNote = (product: ProductProfile) => {
  const missing = [
    !product.name.trim() && "name",
    !product.websiteUrl.trim() && "website",
    !product.description.trim() && "description",
    !product.audience.trim() && "audience",
  ].filter(Boolean);

  return missing.length > 0 ? `Missing: ${missing.join(", ")}` : undefined;
};

export const buildSettingsOverviewCards = ({
  calendarQueueSettings,
  product,
  writingSettings,
}: {
  calendarQueueSettings: CalendarQueueSettings;
  product: ProductProfile;
  writingSettings: BlogGenerationSettings;
}): SettingsOverviewCardData[] => {
  const activeLinkCount = product.siteLinks.filter(isLinkActive).length;
  const enabledExtras = settingsToggleOptions
    .filter((option) => writingSettings[option.key])
    .map((option) => option.label);
  const imageStyleLabel =
    imageStyleOptions.find((option) => option.value === writingSettings.imageStyle)
      ?.label || writingSettings.imageStyle;
  const imagesPerArticleLabel =
    imagesPerArticleOptions.find(
      (option) => option.value === writingSettings.imagesPerArticle,
    )?.label || writingSettings.imagesPerArticle;
  const integration = product.blogPublishingIntegration;

  return [
    {
      id: "product",
      note: getProductNote(product),
      rows: [
        { label: "Name", value: orNotSet(product.name) },
        { label: "Website", value: orNotSet(product.websiteUrl) },
        { label: "Niche", value: orNotSet(product.niche) },
        {
          label: "Details",
          value: [
            countLabel(product.features.length, "feature"),
            countLabel(product.pricing.length, "price"),
            countLabel(product.colors.length, "color"),
          ].join(" · "),
        },
      ],
    },
    {
      id: "writing",
      rows: [
        { label: "Style", value: writingSettings.articleStyle },
        {
          label: "Images",
          value: `${imageStyleLabel} · ${imagesPerArticleLabel}`,
        },
        {
          label: "Links",
          value: `${countLabel(writingSettings.internalLinksPerArticle, "site link")} per article`,
        },
        {
          label: "Extras",
          value: enabledExtras.length > 0 ? enabledExtras.join(", ") : "None",
        },
        {
          label: "Writing rules",
          value: writingSettings.globalArticleInstructions.trim()
            ? "Added"
            : "None",
        },
      ],
    },
    {
      id: "links",
      note:
        product.siteLinks.length === 0
          ? "No links yet. Scan your site from Product."
          : undefined,
      rows: [
        { label: "Can use", value: countLabel(activeLinkCount, "page") },
        {
          label: "Do not use",
          value: countLabel(product.siteLinks.length - activeLinkCount, "page"),
        },
      ],
    },
    {
      id: "publishing",
      rows: [
        {
          label: "Status",
          value: integration?.enabled ? "Connected" : "Not connected",
        },
        {
          label: "Sends to",
          value: integration?.enabled ? orNotSet(integration.webhookUrl) : "Nowhere yet",
        },
      ],
    },
    {
      id: "calendar",
      rows: [
        {
          label: "Fill days",
          value: formatCalendarQueueSummary(calendarQueueSettings).replace(
            "Queue: ",
            "",
          ),
        },
      ],
    },
    {
      id: "backups",
      rows: [{ label: "Saved", value: "On this computer" }],
    },
  ];
};
