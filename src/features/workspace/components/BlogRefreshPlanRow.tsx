"use client";

import { Plus, WandSparkles } from "lucide-react";
import { PrimaryButton } from "./PrimaryButton";
import { SecondaryButton } from "./SecondaryButton";
import type { ApplyDiscoveryPlan } from "../types/ApplyDiscoveryPlan";
import type { SaveDiscoveryPlan } from "../types/SaveDiscoveryPlan";
import type { TopicDiscoveryPlanItem } from "../types/topicDiscovery/TopicDiscoveryPlanItem";

type BlogRefreshPlanRowProps = {
  isApplied: boolean;
  isBusy: boolean;
  isSaved: boolean;
  item: TopicDiscoveryPlanItem;
  onApply?: ApplyDiscoveryPlan;
  onSave?: SaveDiscoveryPlan;
};

export const BlogRefreshPlanRow = ({
  isApplied,
  isBusy,
  isSaved,
  item,
  onApply,
  onSave,
}: BlogRefreshPlanRowProps) => {
  return (
    <article className="grid gap-3 border-t border-black py-3 first:border-t-0">
      <div className="grid gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded border border-black px-2 py-1 text-xs font-semibold uppercase text-black">
            {item.sourceType}
          </span>
          <h4 className="text-sm font-semibold text-black">{item.title}</h4>
        </div>
        <p className="text-sm text-black">{item.summary}</p>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
        {onSave ? (
          <SecondaryButton
            disabled={isSaved || isBusy}
            onClick={() => onSave(item)}
            type="button"
          >
            <Plus size={16} aria-hidden="true" />
            {isSaved ? "Saved" : "Save plan"}
          </SecondaryButton>
        ) : null}
        {onApply ? (
          <PrimaryButton
            disabled={isApplied || isBusy}
            onClick={() => onApply(item)}
            type="button"
          >
            <WandSparkles size={16} aria-hidden="true" />
            {isApplied ? "Added" : "Add to draft"}
          </PrimaryButton>
        ) : null}
      </div>
    </article>
  );
};
