"use client";

import { topicStatusFilterOptions } from "../constants/topicStatusFilterOptions";
import type { TopicStatusFilter } from "../types/TopicStatusFilter";

type TopicStatusFilterTabsProps = {
  activeFilter: TopicStatusFilter;
  onChange: (filter: TopicStatusFilter) => void;
};

export const TopicStatusFilterTabs = ({
  activeFilter,
  onChange,
}: TopicStatusFilterTabsProps) => {
  return (
    <div className="mt-4 flex flex-wrap gap-2" role="tablist">
      {topicStatusFilterOptions.map((option) => {
        const isActive = option.value === activeFilter;

        return (
          <button
            aria-selected={isActive}
            className={`h-9 rounded-md border border-black px-3 text-sm font-semibold transition ${
              isActive ? "bg-black text-white" : "bg-white text-black"
            }`}
            key={option.value}
            onClick={() => onChange(option.value)}
            role="tab"
            type="button"
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
};
