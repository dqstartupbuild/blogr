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
import { extractSerpSignals } from "@/server/topics/extractSerpSignals";
import { generateTopicIdeas } from "@/server/topics/generateTopicIdeas";
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

    const queries = buildTopicBatchDiscoveryQueries({
      product: input.product,
    });
    const records = await runGoogleSearchScraper({
      includeAiMode: false,
      queries,
    });
    const signals = extractSerpSignals(records);
    const discovery = await generateTopicIdeas({
      existingBlogs: input.existingBlogs,
      existingTopics: input.existingTopics.map((topic) => topic.keyword),
      product: input.product,
      signals,
    });
    const candidates = buildTopicCandidatesFromDiscovery(discovery);
    const existingBlogTopics = input.existingBlogs
      .map((blog) => ({ keyword: blog.keyword || blog.title }))
      .filter((blog) => blog.keyword.trim());
    const uniqueCandidates = buildUniqueTopicCandidates({
      candidates,
      existingTopics: [...input.existingTopics, ...existingBlogTopics],
    });
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
