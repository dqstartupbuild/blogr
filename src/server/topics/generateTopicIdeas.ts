import { runReplicateText } from "../replicate/runReplicateText";
import { buildTopicDiscoveryPrompt } from "./buildTopicDiscoveryPrompt";
import { createFallbackTopicDiscoveryResult } from "./createFallbackTopicDiscoveryResult";
import { parseTopicDiscoveryJson } from "./parseTopicDiscoveryJson";
import type { TopicDiscoveryResult } from "@/features/workspace/types/topicDiscovery/TopicDiscoveryResult";
import type { SerpSignal } from "./types/SerpSignal";
import type { TopicDiscoveryExistingBlog } from "./types/TopicDiscoveryExistingBlog";
import type { TopicDiscoveryProduct } from "./types/TopicDiscoveryProduct";

type GenerateTopicIdeasOptions = {
  existingBlogs: TopicDiscoveryExistingBlog[];
  existingTopics: string[];
  product: TopicDiscoveryProduct;
  seedKeyword?: string;
  signals: SerpSignal[];
};

export const generateTopicIdeas = async ({
  existingBlogs,
  existingTopics,
  product,
  seedKeyword,
  signals,
}: GenerateTopicIdeasOptions): Promise<TopicDiscoveryResult> => {
  const fallback = createFallbackTopicDiscoveryResult({
    existingBlogs,
    existingTopics,
    product,
    signals,
  });

  if (!process.env.REPLICATE_API_TOKEN) {
    return fallback;
  }

  try {
    const text = await runReplicateText({
      maxTokens: 5000,
      prompt: buildTopicDiscoveryPrompt({
        existingBlogs,
        existingTopics,
        product,
        seedKeyword,
        signals,
      }),
      systemPrompt:
        "You turn Google SERP data into practical blog topics, writing briefs, FAQ ideas, content gaps, and search strategy notes. Return JSON only.",
    });
    const discovery = parseTopicDiscoveryJson(text);

    return {
      ...fallback,
      ...discovery,
      rawSignalsCount: signals.length,
    };
  } catch {
    return fallback;
  }
};
