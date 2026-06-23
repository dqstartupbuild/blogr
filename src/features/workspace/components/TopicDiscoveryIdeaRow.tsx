"use client";

import type { TopicDiscoveryIdea } from "../types/topicDiscovery/TopicDiscoveryIdea";

type TopicDiscoveryIdeaRowProps = {
  idea: TopicDiscoveryIdea;
  isSelected: boolean;
  onToggle: (title: string) => void;
};

export const TopicDiscoveryIdeaRow = ({
  idea,
  isSelected,
  onToggle,
}: TopicDiscoveryIdeaRowProps) => {
  return (
    <label className="grid cursor-pointer grid-cols-[auto_minmax(0,1fr)] gap-3 border-t border-black py-3 first:border-t-0">
      <input
        checked={isSelected}
        className="mt-1 h-4 w-4 accent-black"
        onChange={() => onToggle(idea.title)}
        type="checkbox"
      />
      <span className="grid min-w-0 gap-2">
        <span className="font-semibold text-black">{idea.title}</span>
        <span className="text-sm text-black">{idea.angle}</span>
        <span className="text-xs font-semibold uppercase text-black">
          {idea.cluster} / {idea.difficulty}
        </span>
        {idea.brief.sections.length > 0 ? (
          <span className="text-sm text-black">
            Brief: {idea.brief.sections.slice(0, 3).join("; ")}
          </span>
        ) : null}
      </span>
    </label>
  );
};
