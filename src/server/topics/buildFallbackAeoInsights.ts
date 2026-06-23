import type { TopicDiscoveryAeoInsight } from "@/features/workspace/types/topicDiscovery/TopicDiscoveryAeoInsight";
import type { SerpSignal } from "./types/SerpSignal";
import type { TopicDiscoveryProduct } from "./types/TopicDiscoveryProduct";

type BuildFallbackAeoInsightsOptions = {
  product: TopicDiscoveryProduct;
  signals: SerpSignal[];
};

export const buildFallbackAeoInsights = ({
  product,
  signals,
}: BuildFallbackAeoInsightsOptions): TopicDiscoveryAeoInsight[] => {
  const productName = product.name.trim().toLowerCase();

  return signals
    .filter((signal) => signal.aiAnswers.length > 0)
    .map((signal) => {
      const combinedText = signal.aiAnswers
        .map((answer) => answer.text)
        .join(" ")
        .toLowerCase();

      return {
        productMentioned: productName ? combinedText.includes(productName) : false,
        query: signal.query,
        recommendations: [
          "Use clear, direct answers near the top of related posts.",
          "Add concise FAQ answers that match the questions people ask.",
        ],
        summary: signal.aiAnswers[0]?.text.slice(0, 280) || "",
      };
    })
    .slice(0, 6);
};
