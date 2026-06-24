"use client";

import { blogStatusFilterOptions } from "../constants/blogStatusFilterOptions";
import type { BlogStatusFilter } from "../types/BlogStatusFilter";

type BlogStatusFilterTabsProps = {
  activeFilter: BlogStatusFilter;
  onChange: (filter: BlogStatusFilter) => void;
};

export const BlogStatusFilterTabs = ({
  activeFilter,
  onChange,
}: BlogStatusFilterTabsProps) => {
  return (
    <div className="mt-4 flex flex-wrap gap-2" role="tablist">
      {blogStatusFilterOptions.map((option) => {
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
