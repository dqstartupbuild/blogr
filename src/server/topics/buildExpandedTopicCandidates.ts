import { buildTopicExpansionBasePhrases } from "./buildTopicExpansionBasePhrases";
import { buildTopicExpansionCandidateNotes } from "./buildTopicExpansionCandidateNotes";
import { buildTopicExpansionKeyword } from "./buildTopicExpansionKeyword";
import { buildTopicExpansionScopes } from "./buildTopicExpansionScopes";
import { createTopicCandidate } from "./createTopicCandidate";
import { topicExpansionPatterns } from "./topicExpansionPatterns";
import type { TopicCandidate } from "./types/TopicCandidate";
import type { TopicDiscoveryProduct } from "./types/TopicDiscoveryProduct";

type BuildExpandedTopicCandidatesOptions = {
  limit: number;
  offset?: number;
  product: TopicDiscoveryProduct;
};

export const buildExpandedTopicCandidates = ({
  limit,
  offset = 0,
  product,
}: BuildExpandedTopicCandidatesOptions) => {
  const basePhrases = buildTopicExpansionBasePhrases(product);
  const scopes = buildTopicExpansionScopes(product);
  const candidates: TopicCandidate[] = [];
  const seenIntentKeys = new Set<string>();
  const totalCombinations =
    basePhrases.length * scopes.length * topicExpansionPatterns.length;

  if (totalCombinations === 0) {
    return candidates;
  }

  for (
    let step = 0;
    step < totalCombinations && candidates.length < limit;
    step += 1
  ) {
    const index = offset + step;

    if (index >= totalCombinations) {
      break;
    }

    const pattern = topicExpansionPatterns[index % topicExpansionPatterns.length];
    const scope =
      scopes[
        Math.floor(index / topicExpansionPatterns.length) % scopes.length
      ];
    const base =
      basePhrases[
        Math.floor(index / (topicExpansionPatterns.length * scopes.length)) %
          basePhrases.length
      ];
    const keyword = buildTopicExpansionKeyword({ base, pattern, scope });
    const candidate = createTopicCandidate({
      intent: pattern.intent,
      keyword,
      notes: buildTopicExpansionCandidateNotes({
        base,
        pattern,
        product,
        scope,
      }),
      sourceType: pattern.sourceType,
    });

    if (!candidate || seenIntentKeys.has(candidate.intentKey)) {
      continue;
    }

    seenIntentKeys.add(candidate.intentKey);
    candidates.push(candidate);
  }

  return candidates;
};
