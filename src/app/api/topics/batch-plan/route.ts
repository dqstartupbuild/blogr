import { NextResponse } from "next/server";
import { runGoogleSearchScraper } from "@/server/apify/runGoogleSearchScraper";
import { requireRouteUserId } from "@/server/auth/requireRouteUserId";
import { getErrorStatus } from "@/server/http/getErrorStatus";
import { getPublicErrorMessage } from "@/server/http/getPublicErrorMessage";
import { logRouteError } from "@/server/http/logRouteError";
import { assignTopicCandidatesToDates } from "@/server/topics/assignTopicCandidatesToDates";
import { buildTopicBatchDiscoveryQueries } from "@/server/topics/buildTopicBatchDiscoveryQueries";
import { buildTopicCandidatesFromDiscovery } from "@/server/topics/buildTopicCandidatesFromDiscovery";
import { buildUniqueTopicCandidates } from "@/server/topics/buildUniqueTopicCandidates";
import { buildExpandedTopicCandidates } from "@/server/topics/buildExpandedTopicCandidates";
import { extractSerpSignals } from "@/server/topics/extractSerpSignals";
import { generateTopicIdeas } from "@/server/topics/generateTopicIdeas";
import { topicExpansionPatterns } from "@/server/topics/topicExpansionPatterns";
import type { TopicCandidate } from "@/server/topics/types/TopicCandidate";
import { topicBatchPlanRequestSchema } from "./schema";

export const maxDuration = 300;

export async function POST(request: Request) {
  try {
    await requireRouteUserId();

    const body = await request.json();
    const input = topicBatchPlanRequestSchema.parse(body);
    const blankDates = Array.from(new Set(input.blankDates)).slice(0, 30);

    if (blankDates.length === 0) {
      return NextResponse.json({ topics: [] });
    }

    const existingBlogTopics = input.existingBlogs
      .map((blog) => ({ keyword: blog.keyword || blog.title }))
      .filter((blog) => blog.keyword.trim());
    const existingTopics = [...input.existingTopics, ...existingBlogTopics];
    let discoveryCandidates: TopicCandidate[] = [];

    try {
      const queries = buildTopicBatchDiscoveryQueries({
        product: input.product,
      });
      const records = await runGoogleSearchScraper({
        includeAiMode: false,
        queries,
        timeoutMs: 15000,
      });
      const signals = extractSerpSignals(records);
      const discovery = await generateTopicIdeas({
        existingBlogs: input.existingBlogs,
        existingTopics: input.existingTopics.map((topic) => topic.keyword),
        product: input.product,
        signals,
      });
      discoveryCandidates = buildTopicCandidatesFromDiscovery(discovery);
    } catch {
      discoveryCandidates = [];
    }

    let expansionOffset = 0;
    const expansionBatchSize = Math.max(
      blankDates.length,
      topicExpansionPatterns.length,
    );
    const expandedCandidates: TopicCandidate[] = [];
    let uniqueCandidates: TopicCandidate[] = [];

    while (uniqueCandidates.length < blankDates.length) {
      const expansionBatch = buildExpandedTopicCandidates({
        limit: expansionBatchSize,
        offset: expansionOffset,
        product: input.product,
      });

      if (expansionBatch.length === 0) {
        break;
      }

      expandedCandidates.push(...expansionBatch);
      uniqueCandidates = buildUniqueTopicCandidates({
        candidates: [...discoveryCandidates, ...expandedCandidates],
        existingTopics,
      });
      expansionOffset += expansionBatchSize;
    }

    const topics = assignTopicCandidatesToDates({
      candidates: uniqueCandidates,
      dates: blankDates,
    });

    return NextResponse.json({ topics });
  } catch (error) {
    logRouteError(error);

    return NextResponse.json(
      { error: getPublicErrorMessage(error) },
      { status: getErrorStatus(error) },
    );
  }
}
