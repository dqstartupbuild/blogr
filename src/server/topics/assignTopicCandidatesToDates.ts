import type { ScheduledTopicCandidate } from "./types/ScheduledTopicCandidate";
import type { TopicCandidate } from "./types/TopicCandidate";

export const assignTopicCandidatesToDates = ({
  candidates,
  dates,
}: {
  candidates: TopicCandidate[];
  dates: string[];
}): ScheduledTopicCandidate[] => {
  return dates.slice(0, candidates.length).map((date, index) => {
    const candidate = candidates[index];

    return {
      canonicalKeyword: candidate.canonicalKeyword,
      intentKey: candidate.intentKey,
      keyword: candidate.keyword,
      notes: candidate.notes,
      scheduledDate: date,
      sourceType: candidate.sourceType,
    };
  });
};
