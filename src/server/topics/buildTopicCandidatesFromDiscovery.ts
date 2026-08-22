import { buildAeoTopicCandidateNotes } from "./buildAeoTopicCandidateNotes";
import { buildDifficultyTopicCandidateNotes } from "./buildDifficultyTopicCandidateNotes";
import { buildGapTopicCandidateNotes } from "./buildGapTopicCandidateNotes";
import { buildIdeaTopicCandidateNotes } from "./buildIdeaTopicCandidateNotes";
import { createTopicCandidate } from "./createTopicCandidate";
import type { TopicDiscoveryResult } from "@/features/workspace/types/topicDiscovery/TopicDiscoveryResult";
import type { TopicCandidate } from "./types/TopicCandidate";

export const buildTopicCandidatesFromDiscovery = (
  discovery: TopicDiscoveryResult,
) => {
  const candidates: TopicCandidate[] = [];

  discovery.ideas.forEach((idea) => {
    const candidate = createTopicCandidate({
      difficulty: idea.difficulty,
      intent: idea.brief.intent || idea.intent,
      keyword: idea.title,
      notes: buildIdeaTopicCandidateNotes(idea),
      sourceSignals: idea.sourceSignals,
      sourceType: "discovery",
    });

    if (candidate) {
      candidates.push(candidate);
    }
  });

  discovery.contentGaps.forEach((gap) => {
    const candidate = createTopicCandidate({
      keyword: gap.title,
      notes: buildGapTopicCandidateNotes(gap),
      sourceSignals: gap.source ? [gap.source] : [],
      sourceType: "gap",
    });

    if (candidate) {
      candidates.push(candidate);
    }
  });

  discovery.faqQuestions.forEach((question) => {
    const candidate = createTopicCandidate({
      intent: "Answer a real question searchers ask.",
      keyword: question,
      notes: question,
      sourceType: "question",
    });

    if (candidate) {
      candidates.push(candidate);
    }
  });

  discovery.comparisonTopics.forEach((topic) => {
    const candidate = createTopicCandidate({
      intent: "Help readers compare options before they choose.",
      keyword: topic,
      notes: "A comparison or alternatives angle from search patterns.",
      sourceType: "comparison",
    });

    if (candidate) {
      candidates.push(candidate);
    }
  });

  discovery.aeoInsights.forEach((insight) => {
    const candidate = createTopicCandidate({
      intent: "Improve coverage for search and AI answer surfaces.",
      keyword: insight.query,
      notes: buildAeoTopicCandidateNotes(insight),
      sourceType: "aeo",
    });

    if (candidate) {
      candidates.push(candidate);
    }
  });

  discovery.difficultyNotes.forEach((note) => {
    const candidate = createTopicCandidate({
      difficulty: note.level,
      intent: "Use difficulty as a planning signal before writing.",
      keyword: note.query,
      notes: buildDifficultyTopicCandidateNotes(note),
      sourceType: "difficulty",
    });

    if (candidate) {
      candidates.push(candidate);
    }
  });

  return candidates;
};
