import type { BlogGenerationSettings } from "../types/BlogGenerationSettings";

type SettingsToggleKey = Extract<
  keyof BlogGenerationSettings,
  | "tableOfContents"
  | "youtubeVideo"
  | "callToAction"
  | "includeInfographics"
  | "mentionSimilarProducts"
  | "firstPersonWriting"
>;

export const settingsToggleOptions = [
  {
    description:
      "Add a simple section list near the top based on the article headings.",
    key: "tableOfContents",
    label: "Table of contents",
  },
  {
    description:
      "Find useful YouTube videos and include them when they fit the article.",
    key: "youtubeVideo",
    label: "YouTube video",
  },
  {
    description:
      "End with a clear next step that points readers back to your website.",
    key: "callToAction",
    label: "Call-to-action",
  },
  {
    description:
      "Use data-style visuals when an article talks through numbers or comparisons.",
    key: "includeInfographics",
    label: "Include infographics",
  },
  {
    description:
      "Mention similar products and tools when comparisons would help readers.",
    key: "mentionSimilarProducts",
    label: "Mention similar products and tools",
  },
  {
    description:
      'Let articles use "I" and "my" when a personal voice feels natural.',
    key: "firstPersonWriting",
    label: "First-person writing",
  },
] as const satisfies readonly {
  description: string;
  key: SettingsToggleKey;
  label: string;
}[];
