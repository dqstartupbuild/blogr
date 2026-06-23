import { buildFallbackMetaDescriptions } from "./buildFallbackMetaDescriptions";
import { buildFallbackTitleOptions } from "./buildFallbackTitleOptions";
import { buildSerpSourceLinks } from "./buildSerpSourceLinks";
import { detectTopicCluster } from "./detectTopicCluster";
import { estimateTopicDifficulty } from "./estimateTopicDifficulty";
import type { SerpSignal } from "./types/SerpSignal";
import type { TopicDiscoveryIdea } from "@/features/workspace/types/topicDiscovery/TopicDiscoveryIdea";

type BuildFallbackTopicIdeaOptions = {
  questions: string[];
  signals: SerpSignal[];
  title: string;
};

export const buildFallbackTopicIdea = ({
  questions,
  signals,
  title,
}: BuildFallbackTopicIdeaOptions): TopicDiscoveryIdea => {
  const cluster = detectTopicCluster(title);

  return {
    angle: "Answer a real search question with plain examples and a clear next step.",
    brief: {
      intent: "Help the reader understand the topic and decide what to do next.",
      sections: [
        "Start with the direct answer",
        "Explain what matters most",
        "Show practical examples",
        "Compare the common options",
        "End with a simple recommendation",
      ],
      sources: buildSerpSourceLinks(signals),
      weakSpots: [
        "Ranking posts often stay broad.",
        "Many snippets do not connect the advice to a specific product fit.",
      ],
    },
    cluster,
    difficulty: estimateTopicDifficulty(title, signals),
    faqQuestions: questions.slice(0, 5),
    intent: "Help the reader make a confident choice.",
    metaDescriptions: buildFallbackMetaDescriptions(title),
    sourceSignals: questions.slice(0, 3),
    title,
    titleOptions: buildFallbackTitleOptions(title),
  };
};
