import { randomUUID } from "node:crypto";
import type { LocalState } from "../../domain/LocalState";
import type { TopicItem } from "@/features/workspace/types/TopicItem";
import { buildTopicIntentKey } from "@/server/topics/buildTopicIntentKey";
import { isValidCalendarDate } from "../../domain/isValidCalendarDate";
import { collectTakenTopicKeys } from "./collectTakenTopicKeys";
import { getTopicWorkspace } from "./getTopicWorkspace";

export const createScheduledTopicBatch = (state: LocalState, args: Record<string, unknown>) => {
  const productId = getTopicWorkspace(state, args);
  const candidates = (args.topics as Array<{ keyword: string; canonicalKeyword?: string; intentKey?: string; scheduledDate: string; notes?: string; sourceType?: TopicItem["sourceType"] }> || []).slice(0, 30);
  const occupied = new Set(state.topics.filter((item) => item.productId === productId).map((item) => item.scheduledDate).filter(Boolean));
  const existing = collectTakenTopicKeys(state, productId);
  let createdCount = 0; let skippedCount = 0;
  for (const candidate of candidates) {
    const keyword = candidate.keyword.trim(); const canonicalKeyword = (candidate.canonicalKeyword || keyword).trim(); const intentKey = candidate.intentKey?.trim() || buildTopicIntentKey(canonicalKeyword);
    if (!keyword || !isValidCalendarDate(candidate.scheduledDate) || occupied.has(candidate.scheduledDate) || existing.has(keyword.toLowerCase()) || existing.has(intentKey)) { skippedCount++; continue; }
    const now = Date.now();
    state.topics.push({ id: randomUUID(), productId, keyword, canonicalKeyword, intentKey, notes: candidate.notes?.trim(), scheduledDate: candidate.scheduledDate, status: "scheduled", sourceType: candidate.sourceType || "discovery", createdAt: now, updatedAt: now });
    occupied.add(candidate.scheduledDate); existing.add(keyword.toLowerCase()); existing.add(canonicalKeyword.toLowerCase()); existing.add(intentKey); createdCount++;
  }
  return { createdCount, skippedCount };
};
