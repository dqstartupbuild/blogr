"use client";

import { TopicDiscoveryPlanItemRow } from "./TopicDiscoveryPlanItemRow";
import type { TopicDiscoveryPlanItem } from "../types/topicDiscovery/TopicDiscoveryPlanItem";

type TopicDiscoveryPlanListProps = {
  items: TopicDiscoveryPlanItem[];
  onSave: (item: TopicDiscoveryPlanItem) => void;
  savedItemIds: string[];
};

export const TopicDiscoveryPlanList = ({
  items,
  onSave,
  savedItemIds,
}: TopicDiscoveryPlanListProps) => {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className="grid gap-2">
      <h3 className="text-sm font-semibold text-black">Plans from search</h3>
      <div className="rounded-md border border-black px-3">
        {items.map((item) => (
          <TopicDiscoveryPlanItemRow
            isSaved={savedItemIds.includes(item.id)}
            item={item}
            key={item.id}
            onSave={onSave}
          />
        ))}
      </div>
    </section>
  );
};
