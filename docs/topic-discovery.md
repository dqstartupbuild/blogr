# Topic Discovery

## What It Does

Topic Discovery helps users find blog topics inside the Topics tab. The user can click **Find topic ideas**, add an optional seed keyword, review a list of suggested topics, choose the ones they want, and save them.

The app does not save every scraped idea automatically. It shows a review queue with checkboxes because search results can be noisy.

The discovery dialog also shows planning ideas from the same search run. Users can save questions, gaps, comparison ideas, clusters, refresh notes, AI answer notes, and difficulty notes as planning topics.

## How It Works

The client calls `POST /api/topics/discover` with the current product profile, existing topics, existing blogs, a seed keyword, and whether to check AI answers.

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

When a user clicks **Save plan** on a non-topic insight, the app saves that insight as a topic with its source context in notes. That gives users a simple way to turn gaps, refresh ideas, comparison angles, AI answer notes, and difficulty notes into work they can write or plan from later.

Existing topics also have a **Find brief** or **View brief** action. Users can review the saved notes, refresh the brief from a new search, and then write the topic with that brief.

Existing blogs have **Find refresh ideas**. Users can search again for the blog keyword, save refresh plans as topics, or add a plan directly to the draft from the blog editor.

## Environment

The live discovery route requires:

```text
APIFY_TOKEN=
```

`REPLICATE_API_TOKEN` is optional for this feature. Without it, the route still returns fallback ideas from scraped search signals.

## Relevant Code

- `src/app/api/topics/discover/route.ts`
- `src/app/api/topics/discover/schema.ts`
- `src/server/apify/runGoogleSearchScraper.ts`
- `src/server/apify/getApifyToken.ts`
- `src/server/topics/buildTopicDiscoveryQueries.ts`
- `src/server/topics/extractSerpSignals.ts`
- `src/server/topics/generateTopicIdeas.ts`
- `src/server/topics/createFallbackTopicDiscoveryResult.ts`
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
