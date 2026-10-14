import { buildSerpSignalsPromptData } from "./buildSerpSignalsPromptData";
import type { SerpSignal } from "./types/SerpSignal";
import type { TopicDiscoveryExistingBlog } from "./types/TopicDiscoveryExistingBlog";
import type { TopicDiscoveryProduct } from "./types/TopicDiscoveryProduct";

type BuildTopicDiscoveryPromptOptions = {
  existingBlogs: TopicDiscoveryExistingBlog[];
  existingTopics: string[];
  product: TopicDiscoveryProduct;
  seedKeyword?: string;
  signals: SerpSignal[];
};

export const buildTopicDiscoveryPrompt = ({
  existingBlogs,
  existingTopics,
  product,
  seedKeyword,
  signals,
}: BuildTopicDiscoveryPromptOptions) => {
  return `
Return JSON only. Do not include markdown fences.

Use the product profile and Google SERP signals to create search-informed blog topic ideas.
Avoid copying competitor titles. Make topics useful, specific, and easy for a non-technical user to understand.
Avoid ideas that are already in existingTopics.

Required JSON shape:
{
  "ideas": [
    {
      "title": "topic to save",
      "angle": "why this topic is worth writing",
      "intent": "what the searcher wants",
      "cluster": "Comparison posts | How-to posts | Problem-aware posts | Alternatives posts | Question-led posts",
      "difficulty": "low | medium | high",
      "sourceSignals": ["short signal from SERP"],
      "brief": {
        "intent": "writing brief",
        "sections": ["section to cover"],
        "weakSpots": ["weakness in ranking content"],
        "sources": [{"title":"source title","url":"https://example.com","reason":"why it helps"}]
      },
      "faqQuestions": ["People Also Ask style question"],
      "titleOptions": ["better title option"],
      "metaDescriptions": ["plain meta description"]
    }
  ],
  "clusters": [{"name":"cluster name","purpose":"why it helps","topicTitles":["topic"]}],
  "faqQuestions": ["best FAQ questions"],
  "contentGaps": [{"title":"gap","reason":"why it matters","source":"SERP source"}],
  "refreshSuggestions": [{"blogTitle":"existing blog","reason":"why refresh","updates":["update to make"]}],
  "comparisonTopics": ["bottom-of-funnel comparison or alternatives topic"],
  "aeoInsights": [{"query":"search query","productMentioned":false,"summary":"AI answer summary","recommendations":["what to improve"]}],
  "difficultyNotes": [{"query":"search query","level":"low | medium | high","reason":"why"}],
  "rawSignalsCount": ${signals.length}
}

Product:
${JSON.stringify(product, null, 2)}

Seed keyword:
${seedKeyword || ""}

Existing topics:
${JSON.stringify(existingTopics, null, 2)}

Existing blogs:
${JSON.stringify(existingBlogs.slice(0, 12), null, 2)}

SERP signals:
${JSON.stringify(buildSerpSignalsPromptData(signals), null, 2)}
`.trim();
};
