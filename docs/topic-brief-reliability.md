# Topic Brief Reliability

## Overview

Finding a topic brief uses the durable background worker without accidentally starting the same long search twice. The route returns the completed brief when it is ready, or a background status while the worker finishes, instead of running into the web request limit and showing a generic error.

## How It Works

1. The route verifies the signed-in user and loads the topic once.
2. When the background worker is configured, the route creates the brief job and waits for a result.
3. Job checks use an increasing delay, from two seconds up to fifteen seconds, instead of reading the job every two seconds for the full request.
4. Polling is capped at four minutes and never sleeps past that deadline. This leaves one minute for authentication, dispatch, the final database read, and the response before the route's five-minute limit.
5. The shared worker poller handles temporary Convex read failures for briefs, blog writing, calendar planning, product scans, topic discovery, and image regeneration. The route returns the durable job ID with a background status while the already-running worker remains the only process doing the work.
6. If the worker reports a real failure, the route returns a brief-specific retry message. It does not repeat the same Apify and Replicate work inside the web request.
7. The in-route search remains available only when Cloud Run cannot be dispatched, so local development and dispatch outages still have a fallback.

## Database Read Behavior

The topic ownership read is unchanged. Worker requests use progressively spaced job reads and a four-minute maximum wait. A temporary read failure no longer triggers a second full search. This reduces duplicate provider calls, avoids duplicate writes, and keeps the request below its runtime limit.

## Relevant Code

- `src/app/api/topics/[topicId]/brief/route.ts`
- `src/server/blogAiWorker/waitForBlogAiJob.ts`
- `src/server/blogAiWorker/getBlogAiJobPollDelayMs.ts`
- `src/server/topics/getTopicBriefFailureMessage.ts`
- `src/server/topics/normalizeTopicBriefRouteError.ts`

## Source References

- [Vercel function duration configuration](https://vercel.com/docs/functions/configuring-functions/duration)

## Use Cases

- Recover inline when Cloud Run cannot start the brief worker.
- Let a dispatched worker finish after a temporary polling failure.
- Show a useful retry message without exposing internal service details.
- Keep long-running job checks from creating avoidable Convex reads.
- Prevent a slow or failed worker from launching a duplicate in-route search.

## File Tree

```text
src/app/api/topics/[topicId]/brief/
  route.ts
src/server/blogAiWorker/
├── getBlogAiJobPollDelayMs.ts
├── getBlogAiJobRouteWaitMs.test.ts
├── getBlogAiJobRouteWaitMs.ts
└── waitForBlogAiJob.ts
src/server/topics/
├── getTopicBriefFailureMessage.ts
└── normalizeTopicBriefRouteError.ts
docs/
  topic-brief-reliability.md
```
