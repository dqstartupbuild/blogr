"use client";

import { TopicDiscoveryIdeaRow } from "./TopicDiscoveryIdeaRow";
import type { TopicDiscoveryIdea } from "../types/topicDiscovery/TopicDiscoveryIdea";

type TopicDiscoveryReviewListProps = {
  ideas: TopicDiscoveryIdea[];
  onToggle: (title: string) => void;
  selectedTitles: string[];
};

export const TopicDiscoveryReviewList = ({
  ideas,
  onToggle,
  selectedTitles,
}: TopicDiscoveryReviewListProps) => {
  if (ideas.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-2">
      <h3 className="text-sm font-semibold text-black">Topic ideas</h3>
      <div className="rounded-md border border-black px-3">
        {ideas.map((idea) => (
          <TopicDiscoveryIdeaRow
            idea={idea}
            isSelected={selectedTitles.includes(idea.title)}
            key={idea.title}
            onToggle={onToggle}
          />
        ))}
      </div>
    </div>
  );
};
