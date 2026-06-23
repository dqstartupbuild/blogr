import { TopicDiscoveryInsightSection } from "./TopicDiscoveryInsightSection";
import type { TopicDiscoveryResult } from "../types/topicDiscovery/TopicDiscoveryResult";

type TopicDiscoveryInsightsProps = {
  discovery: TopicDiscoveryResult;
};

export const TopicDiscoveryInsights = ({
  discovery,
}: TopicDiscoveryInsightsProps) => {
  return (
    <div className="grid gap-3">
      <TopicDiscoveryInsightSection
        items={discovery.faqQuestions.slice(0, 8)}
        title="Questions people ask"
      />
      <TopicDiscoveryInsightSection
        items={discovery.contentGaps.map(
          (gap) => `${gap.title}: ${gap.reason}`,
        )}
        title="Gaps to cover"
      />
      <TopicDiscoveryInsightSection
        items={discovery.comparisonTopics}
        title="Comparison ideas"
      />
      <TopicDiscoveryInsightSection
        items={discovery.clusters.map(
          (cluster) => `${cluster.name}: ${cluster.topicTitles.join(", ")}`,
        )}
        title="Clusters"
      />
      <TopicDiscoveryInsightSection
        items={discovery.refreshSuggestions.map(
          (suggestion) =>
            `${suggestion.blogTitle}: ${suggestion.updates.join("; ")}`,
        )}
        title="Refresh ideas"
      />
      <TopicDiscoveryInsightSection
        items={discovery.aeoInsights.map(
          (insight) =>
            `${insight.query}: ${
              insight.productMentioned ? "Product appears" : "Product missing"
            }. ${insight.recommendations.join("; ")}`,
        )}
        title="AI answer notes"
      />
      <TopicDiscoveryInsightSection
        items={discovery.difficultyNotes.map(
          (note) => `${note.query}: ${note.level}. ${note.reason}`,
        )}
        title="Difficulty notes"
      />
    </div>
  );
};
