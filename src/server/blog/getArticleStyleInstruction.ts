import type { ArticleStyle } from "@/features/workspace/types/ArticleStyle";

export const getArticleStyleInstruction = (articleStyle: ArticleStyle) => {
  switch (articleStyle) {
    case "Simple and Clear":
      return "Use short sentences, plain words, and direct explanations.";
    case "Formal":
      return "Use a polished, careful tone without slang.";
    case "Casual":
      return "Use an easygoing tone that still stays useful.";
    case "Enthusiastic":
      return "Sound upbeat and energetic without hype.";
    case "Persuasive":
      return "Make a strong case with clear reasons and practical proof.";
    case "Professional":
      return "Sound capable, calm, and business-ready.";
    case "Friendly":
      return "Use a warm, helpful tone that feels approachable.";
    case "Entertaining":
      return "Keep the pacing lively while staying clear and useful.";
    case "Inspirational":
      return "Encourage the reader with practical confidence.";
    case "Analytical":
      return "Break down tradeoffs, patterns, and evidence clearly.";
    case "Narrative":
      return "Use story-like flow, examples, and natural transitions.";
    case "Informative":
    default:
      return "Teach the topic clearly with helpful context and examples.";
  }
};
