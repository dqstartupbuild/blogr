# Durable AI Job Status

## Overview

Durable AI work can keep running after its first web request returns. Signed-in clients can now check a job they own and receive its current status or finished result. This prevents a temporary database read problem from making successful blog writing, planning, scanning, image, brief, or discovery work look like it failed.

## How It Works

1. A worker-backed route creates an `aiJobs` record and dispatches Cloud Run.
2. The shared server poller waits within the route's safe time budget.
3. If a Convex job read has a temporary failure, the poller logs it and lets the route return `202` with the durable job ID.
4. `GET /api/ai-jobs/[jobId]` verifies the signed-in user, requests a fresh Convex token, and reads the job through the existing ownership-protected query.
5. The endpoint returns only `status`, `error`, and `result`. It never returns the stored job input.
6. Topic discovery polls this endpoint in the browser when its first request returns without the finished discovery payload.

## Supported Statuses

- `queued`: The worker has not claimed the job yet.
- `running`: The worker is processing the job.
- `succeeded`: The result is ready.
- `failed`: The worker stopped with a real error.

## Security

The route calls `requireRouteUserId` before requesting a Convex token. Convex `getAiJob` checks that the job belongs to the authenticated user and returns `null` for every other user. Missing or inaccessible jobs return a simple `404` response.

## Relevant Code

- `src/app/api/ai-jobs/[jobId]/route.ts`
- `src/server/convex/castAiJobId.ts`
- `src/server/blogAiWorker/waitForBlogAiJob.ts`
- `src/features/workspace/utils/waitForAiJobResult.ts`
- `src/features/workspace/utils/waitForTopicDiscoveryJob.ts`
- `src/features/workspace/types/AiJobStatusResponse.ts`

## Use Cases

- Keep waiting for topic ideas after a slow search.
- Recover from a temporary Convex polling failure without restarting provider work.
- Let persisted worker results finish in the background without showing a false failure.
- Show the real worker error when a durable job genuinely fails.

## Source References

- [Next.js Route Handlers](https://nextjs.org/docs/app/getting-started/route-handlers)

## File Tree

```text
src/app/api/ai-jobs/[jobId]/
  route.ts
src/server/blogAiWorker/
  waitForBlogAiJob.ts
src/server/convex/
  castAiJobId.ts
src/features/workspace/types/
  AiJobStatusResponse.ts
src/features/workspace/utils/
├── waitForAiJobResult.test.ts
├── waitForAiJobResult.ts
└── waitForTopicDiscoveryJob.ts
docs/
  durable-ai-job-status.md
```
