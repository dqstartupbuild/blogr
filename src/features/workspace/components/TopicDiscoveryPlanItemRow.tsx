"use client";

import { Plus } from "lucide-react";
import { SecondaryButton } from "./SecondaryButton";
import type { TopicDiscoveryPlanItem } from "../types/topicDiscovery/TopicDiscoveryPlanItem";

type TopicDiscoveryPlanItemRowProps = {
  isSaved: boolean;
  item: TopicDiscoveryPlanItem;
  onSave: (item: TopicDiscoveryPlanItem) => void;
};

export const TopicDiscoveryPlanItemRow = ({
  isSaved,
  item,
  onSave,
}: TopicDiscoveryPlanItemRowProps) => {
  return (
    <article className="grid gap-3 border-t border-black py-3 first:border-t-0 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
      <div className="grid min-w-0 gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded border border-black px-2 py-1 text-xs font-semibold uppercase text-black">
            {item.sourceType}
          </span>
          <h4 className="text-sm font-semibold text-black">{item.title}</h4>
        </div>
        <p className="text-sm text-black">{item.summary}</p>
        {item.relatedTopicTitles.length > 0 ? (
          <p className="text-xs text-black">
            Related: {item.relatedTopicTitles.slice(0, 3).join(", ")}
          </p>
        ) : null}
      </div>
      <SecondaryButton
        disabled={isSaved}
        onClick={() => onSave(item)}
        type="button"
      >
        <Plus size={16} aria-hidden="true" />
        {isSaved ? "Saved" : "Save plan"}
      </SecondaryButton>
    </article>
  );
};
