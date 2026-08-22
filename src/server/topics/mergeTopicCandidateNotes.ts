import { dedupeTopicStrings } from "./dedupeTopicStrings";
import { selectBestTopicCandidate } from "./selectBestTopicCandidate";
import type { TopicCandidate } from "./types/TopicCandidate";

export const mergeTopicCandidateNotes = (candidates: TopicCandidate[]) => {
  const bestCandidate = selectBestTopicCandidate(candidates);
  const supportingAngles = dedupeTopicStrings(
    candidates
      .filter((candidate) => candidate !== bestCandidate)
      .map((candidate) => `${candidate.sourceType}: ${candidate.canonicalKeyword}`),
  ).slice(0, 6);
  const notes = dedupeTopicStrings(
    candidates.flatMap((candidate) =>
      candidate.notes
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
    ),
  ).slice(0, 40);

  return [
    `Search brief for: ${bestCandidate.canonicalKeyword}`,
    "",
    bestCandidate.intent ? `Intent: ${bestCandidate.intent}` : "",
    `Source: ${bestCandidate.sourceType}`,
    bestCandidate.difficulty ? `Difficulty: ${bestCandidate.difficulty}` : "",
    "",
    supportingAngles.length > 0 ? "Related angles folded into this article:" : "",
    ...supportingAngles.map((angle) => `- ${angle}`),
    "",
    "Planning notes:",
    ...notes.map((note) => `- ${note.replace(/^-+\s*/, "")}`),
  ]
    .filter((line, index, lines) => line || lines[index - 1])
    .join("\n")
    .trim();
};
