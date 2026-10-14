import { settingsSections } from "../constants/settingsSections";
import { buildSettingsOverviewCards } from "../utils/buildSettingsOverviewCards";
import { SettingsOverviewCard } from "./SettingsOverviewCard";
import type { BlogGenerationSettings } from "../types/BlogGenerationSettings";
import type { CalendarQueueSettings } from "../types/CalendarQueueSettings";
import type { ProductProfile } from "../types/ProductProfile";
import type { SettingsSectionId } from "../types/SettingsSectionId";

type SettingsOverviewProps = {
  calendarQueueSettings: CalendarQueueSettings;
  onSelect: (sectionId: SettingsSectionId) => void;
  product: ProductProfile;
  writingSettings: BlogGenerationSettings;
};

export const SettingsOverview = ({
  calendarQueueSettings,
  onSelect,
  product,
  writingSettings,
}: SettingsOverviewProps) => {
  const cards = buildSettingsOverviewCards({
    calendarQueueSettings,
    product,
    writingSettings,
  });

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
      {cards.map((card) => {
        const section = settingsSections.find(({ id }) => id === card.id);

        if (!section) {
          return null;
        }

        return (
          <SettingsOverviewCard
            icon={section.icon}
            key={card.id}
            note={card.note}
            onEdit={() => onSelect(card.id)}
            rows={card.rows}
            title={section.label}
          />
        );
      })}
    </div>
  );
};
