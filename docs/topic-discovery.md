# Topic Discovery

## What It Does

Topic Discovery helps users find blog topics inside the Topics tab. The user can click **Find topic ideas**, add an optional seed keyword, review a list of suggested topics, choose the ones they want, and save them.

The app does not save every scraped idea automatically. It shows a review queue with checkboxes because search results can be noisy.

The discovery dialog also shows planning ideas from the same search run. Users can save questions, gaps, comparison ideas, clusters, refresh notes, AI answer notes, and difficulty notes as planning topics.

The content calendar also uses discovery data for batch planning. In that flow, the app converts normal ideas, gaps, questions, comparison ideas, AI answer notes, and difficulty notes into one shared candidate shape before saving anything. Similar candidates are grouped into one canonical scheduled topic so the calendar does not create several articles that compete for the same search intent. The calendar then adds product-niche expansion candidates so every blank day can still be filled when discovery is sparse.

## How It Works

The client calls `POST /api/topics/discover` with the current product profile, existing topics, existing blogs, a seed keyword, and whether to check AI answers. When the Cloud Run Job worker env vars are set, the route creates a durable Convex AI job and dispatches the Google Cloud AI worker. Otherwise it runs the same workflow locally.

If the initial request returns while the worker is still running, the client keeps checking the authenticated job-status route and opens the finished discovery result as soon as it is ready. This keeps slow topic and refresh searches useful instead of showing a background-started error and losing the generated ideas.

The route builds a small set of Google searches from the product name, niche, audience, and seed keyword. It runs Apify Google Search Scraper through `src/server/apify/runGoogleSearchScraper.ts`, then normalizes:

- People Also Ask questions
- Related searches
- Organic result titles and snippets
- Comparison and alternatives signals
- Google AI Mode text when the user enables AI answer checking

`src/server/topics/generateTopicIdeas.ts` turns those signals into:

- Topic ideas
- Search-informed writing briefs
- FAQ questions
- Competitor content gaps
- Title and meta description ideas
- Topic clusters
- Existing blog refresh suggestions
- Comparison and alternatives topics
- AI answer notes
- Difficulty notes

When Replicate is configured, the writer model creates the final discovery payload. If Replicate is unavailable or returns malformed JSON, the app falls back to deterministic topic ideas built from the SERP signals.

## Saved Briefs

When a user clicks **Add topics**, the selected topic titles are saved through the existing Convex `createTopic` mutation. Each selected topic also saves a plain text brief in the topic `notes` field.

When the user writes a blog from that topic, `useLiveWorkspace` sends the saved notes as `topicBrief` to `/api/blogs/generate`. The blog writer uses that brief to match search intent, answer useful questions, cover weak spots, and shape titles and meta descriptions.

When a user clicks **Save plan** on a non-topic insight, the app saves that insight as a topic with its source context in notes. That gives users a simple way to turn gaps, refresh ideas, comparison angles, AI answer notes, and difficulty notes into work they can write or plan from later. Content gap plans save the actual gap title instead of an internal instruction like `Cover this gap`.

When the calendar fills empty days, those same insight types are not saved as separate planning rows. They are first deduped by canonical keyword and intent key, then merged into the notes for one scheduled topic.

Existing topics also have a **Find brief** or **View brief** action. Users can review the saved notes, refresh the brief from a new search, and then write the topic with that brief.

Existing blogs have **Find refresh ideas**. Users can search again for the blog keyword, save refresh plans as topics, or add a plan directly to the draft from the blog editor.

## Environment

The live discovery route requires:

```text
APIFY_TOKEN=
```

`REPLICATE_API_TOKEN` is optional for this feature. Without it, the route still returns fallback ideas from scraped search signals.

Production deployments can set the Cloud Run Job worker env vars and
`BLOG_AI_WORKER_SECRET` to run Apify search and Replicate topic generation in
the Google Cloud AI worker.

## Relevant Code

- `src/app/api/topics/discover/route.ts`
- `src/app/api/topics/discover/schema.ts`
- `src/app/api/ai-jobs/[jobId]/route.ts`
- `src/app/api/worker/blog-ai/route.ts`
- `src/server/blogAiWorker/`
- `src/server/apify/runGoogleSearchScraper.ts`
- `src/server/apify/getApifyToken.ts`
- `src/server/topics/buildTopicDiscoveryQueries.ts`
- `src/server/topics/extractSerpSignals.ts`
- `src/server/topics/generateTopicIdeas.ts`
- `src/server/topics/createFallbackTopicDiscoveryResult.ts`
- `src/app/api/topics/batch-plan/route.ts`
- `src/server/topics/buildTopicCandidatesFromDiscovery.ts`
- `src/server/topics/buildUniqueTopicCandidates.ts`
- `src/features/workspace/components/TopicDiscoveryLauncher.tsx`
- `src/features/workspace/components/TopicDiscoveryDialog.tsx`
- `src/features/workspace/components/TopicDiscoveryPlanList.tsx`
- `src/features/workspace/components/TopicDiscoveryReviewList.tsx`
- `src/features/workspace/components/TopicDiscoveryInsights.tsx`
- `src/features/workspace/components/TopicBriefDialog.tsx`
- `src/features/workspace/components/BlogRefreshDialog.tsx`
- `src/features/workspace/utils/buildTopicDiscoveryPlanItems.ts`
- `src/features/workspace/utils/buildTopicDiscoveryIdeaNotes.ts`
- `src/features/workspace/utils/buildExistingTopicBriefNotes.ts`
- `src/features/workspace/utils/appendRefreshPlanToMdx.ts`
- `src/features/workspace/utils/waitForTopicDiscoveryJob.ts`
- `src/server/blog/buildTopicBriefPrompt.ts`

## Use Cases

- Find topic ideas when the user is not sure what to write.
- Build briefs from real search questions and ranking pages.
- Add FAQ sections based on People Also Ask questions.
- Spot competitor gaps and comparison angles.
- Save gaps, refresh ideas, and AI answer notes as planning topics.
- Refresh older blogs with questions and angles that now appear in search.
- Refresh the brief for a topic that was saved before discovery existed.
- Add a refresh plan directly to an existing blog draft.
- Fill blank calendar days with unique scheduled topics, even when search or AI returns only a few usable ideas.
- Merge duplicate discovery buckets before creating a 30-day plan.

## File Tree

```text
src/app/api/topics/discover/
src/server/apify/
src/server/topics/
src/features/workspace/components/TopicDiscovery*
src/features/workspace/types/topicDiscovery/
src/features/workspace/utils/buildTopicDiscoveryIdeaNotes.ts
docs/topic-discovery.md
```
