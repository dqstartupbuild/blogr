# Topic Brief Reliability

## Overview

Finding a topic brief now recovers from a failed background worker and returns a clear, brief-specific message if both search paths fail. The route no longer turns every worker error into the generic `Something went wrong` response.

## How It Works

1. The route verifies the signed-in user and loads the topic once.
2. When the background worker is configured, the route creates the brief job and waits for a result.
3. Job checks use an increasing delay, from two seconds up to fifteen seconds, instead of reading the job every two seconds for the full request.
4. If worker dispatch, job waiting, or the worker itself fails, the same request falls back to the in-route topic search.
5. If the fallback also fails, internal details are logged while the user receives a safe message that explains the brief search failed and can be retried.

## Database Read Behavior

The topic ownership read is unchanged. Successful worker requests now use progressively spaced job reads, cutting the worst-case job checks from roughly 140 to about 25 during the default wait window. The inline fallback runs only after a worker-path failure and reuses the topic, product input, and Convex token already loaded by the request.

## Relevant Code

- `src/app/api/topics/[topicId]/brief/route.ts`
- `src/server/blogAiWorker/waitForBlogAiJob.ts`
- `src/server/blogAiWorker/getBlogAiJobPollDelayMs.ts`
- `src/server/topics/getTopicBriefFailureMessage.ts`
- `src/server/topics/normalizeTopicBriefRouteError.ts`

## Use Cases

- Recover when Cloud Run cannot start the brief worker.
- Recover when the worker reports a transient search failure.
- Show a useful retry message without exposing internal service details.
- Keep long-running job checks from creating avoidable Convex reads.

## File Tree

```text
src/app/api/topics/[topicId]/brief/
  route.ts
src/server/blogAiWorker/
├── getBlogAiJobPollDelayMs.ts
└── waitForBlogAiJob.ts
src/server/topics/
├── getTopicBriefFailureMessage.ts
└── normalizeTopicBriefRouteError.ts
docs/
  topic-brief-reliability.md
```
