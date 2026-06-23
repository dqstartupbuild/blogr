import { NextResponse } from "next/server";
import { runGoogleSearchScraper } from "@/server/apify/runGoogleSearchScraper";
import { requireRouteUserId } from "@/server/auth/requireRouteUserId";
import { getErrorStatus } from "@/server/http/getErrorStatus";
import { getPublicErrorMessage } from "@/server/http/getPublicErrorMessage";
import { buildTopicDiscoveryQueries } from "@/server/topics/buildTopicDiscoveryQueries";
import { extractSerpSignals } from "@/server/topics/extractSerpSignals";
import { generateTopicIdeas } from "@/server/topics/generateTopicIdeas";
import { topicDiscoverRequestSchema } from "./schema";

export const maxDuration = 300;

export async function POST(request: Request) {
  try {
    await requireRouteUserId();

    const body = await request.json();
    const input = topicDiscoverRequestSchema.parse(body);
    const queries = buildTopicDiscoveryQueries({
      product: input.product,
      seedKeyword: input.seedKeyword,
    });
    const records = await runGoogleSearchScraper({
      includeAiMode: input.includeAiAnswers,
      queries,
    });
    const signals = extractSerpSignals(records);
    const discovery = await generateTopicIdeas({
      existingBlogs: input.existingBlogs,
      existingTopics: input.existingTopics.map((topic) => topic.keyword),
      product: input.product,
      seedKeyword: input.seedKeyword,
      signals,
    });

    return NextResponse.json({ discovery });
  } catch (error) {
    return NextResponse.json(
      { error: getPublicErrorMessage(error) },
      { status: getErrorStatus(error) },
    );
  }
}
