import { z } from "zod";

const linkItemSchema = z.object({
  reason: z.string().catch("").optional(),
  title: z.string().catch(""),
  url: z.string().catch(""),
});

const topicDiscoveryBriefSchema = z.object({
  intent: z.string().catch(""),
  sections: z.array(z.string().catch("")).catch([]),
  sources: z.array(linkItemSchema).catch([]),
  weakSpots: z.array(z.string().catch("")).catch([]),
});

const topicDiscoveryIdeaSchema = z.object({
  angle: z.string().catch(""),
  brief: topicDiscoveryBriefSchema.catch({
    intent: "",
    sections: [],
    sources: [],
    weakSpots: [],
  }),
  cluster: z.string().catch("Question-led posts"),
  difficulty: z.enum(["low", "medium", "high"]).catch("medium"),
  faqQuestions: z.array(z.string().catch("")).catch([]),
  intent: z.string().catch(""),
  metaDescriptions: z.array(z.string().catch("")).catch([]),
  sourceSignals: z.array(z.string().catch("")).catch([]),
  title: z.string().catch(""),
  titleOptions: z.array(z.string().catch("")).catch([]),
});

const topicDiscoveryClusterSchema = z.object({
  name: z.string().catch("Question-led posts"),
  purpose: z.string().catch("Answer common questions clearly."),
  topicTitles: z.array(z.string().catch("")).catch([]),
});

const topicDiscoveryContentGapSchema = z.object({
  reason: z.string().catch(""),
  source: z.string().catch(""),
  title: z.string().catch(""),
});

const topicDiscoveryRefreshSuggestionSchema = z.object({
  blogTitle: z.string().catch(""),
  reason: z.string().catch(""),
  updates: z.array(z.string().catch("")).catch([]),
});

const topicDiscoveryAeoInsightSchema = z.object({
  productMentioned: z.boolean().catch(false),
  query: z.string().catch(""),
  recommendations: z.array(z.string().catch("")).catch([]),
  summary: z.string().catch(""),
});

const topicDiscoveryDifficultyNoteSchema = z.object({
  level: z.enum(["low", "medium", "high"]).catch("medium"),
  query: z.string().catch(""),
  reason: z.string().catch(""),
});

export const topicDiscoveryResultSchema = z.object({
  aeoInsights: z.array(topicDiscoveryAeoInsightSchema).catch([]),
  clusters: z.array(topicDiscoveryClusterSchema).catch([]),
  comparisonTopics: z.array(z.string().catch("")).catch([]),
  contentGaps: z.array(topicDiscoveryContentGapSchema).catch([]),
  difficultyNotes: z.array(topicDiscoveryDifficultyNoteSchema).catch([]),
  faqQuestions: z.array(z.string().catch("")).catch([]),
  ideas: z.array(topicDiscoveryIdeaSchema).catch([]),
  rawSignalsCount: z.number().catch(0),
  refreshSuggestions: z.array(topicDiscoveryRefreshSuggestionSchema).catch([]),
});
