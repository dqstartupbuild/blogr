import { collectSerpQuestions } from "./collectSerpQuestions";
import type { TopicDiscoveryRefreshSuggestion } from "@/features/workspace/types/topicDiscovery/TopicDiscoveryRefreshSuggestion";
import type { SerpSignal } from "./types/SerpSignal";
import type { TopicDiscoveryExistingBlog } from "./types/TopicDiscoveryExistingBlog";

type BuildFallbackRefreshSuggestionsOptions = {
  blogs: TopicDiscoveryExistingBlog[];
  signals: SerpSignal[];
};

export const buildFallbackRefreshSuggestions = ({
  blogs,
  signals,
}: BuildFallbackRefreshSuggestionsOptions): TopicDiscoveryRefreshSuggestion[] => {
  const questions = collectSerpQuestions(signals).slice(0, 4);

  return blogs.slice(0, 5).map((blog) => ({
    blogTitle: blog.title || blog.keyword,
    reason: "New search questions can make this post more useful.",
    updates:
      questions.length > 0
        ? questions
        : ["Add a clearer answer near the top.", "Refresh examples and sources."],
  }));
};
