import { areTopicCandidatesSimilar } from "./areTopicCandidatesSimilar";
import type { TopicCandidate } from "./types/TopicCandidate";

export const groupTopicCandidates = (candidates: TopicCandidate[]) => {
  const groups: TopicCandidate[][] = [];

  candidates.forEach((candidate) => {
    const group = groups.find((items) =>
      items.some((item) => areTopicCandidatesSimilar(item, candidate)),
    );

    if (group) {
      group.push(candidate);
      return;
    }

    groups.push([candidate]);
  });

  return groups;
};
