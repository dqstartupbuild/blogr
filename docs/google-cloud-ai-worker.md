# Google Cloud AI Worker Job

## What It Does

The Google Cloud AI worker moves expensive writing, planning, search briefing,
image generation, and product-profile extraction work out of the web runtime.
When the Cloud Run Job env vars are set, the signed-in API routes authenticate
the user, create a durable Convex `aiJobs` record, dispatch one Cloud Run Job
execution, and return either the finished result or the queued job status.

The Cloud Run Job starts only when dispatched. It claims queued work, processes a
bounded number of jobs, marks each job succeeded or failed, then exits.

Without the Cloud Run Job env vars, the same routes keep running locally. This
keeps local development and preview branches usable without Google Cloud.

## Workloads

The worker job handles:

- Blog writing through `POST /api/blogs/generate`.
- Topic discovery, topic brief refresh, and blog refresh ideas through
  `POST /api/topics/discover`.
- Calendar topic planning through `POST /api/topics/batch-plan`.
- Blog image regeneration through `POST /api/blogs/[blogId]/regenerate-image`.
- Product website profile extraction and scanned image storage through
  `POST /api/product/scan`.

The web routes still handle Clerk auth, input validation, Convex ownership
checks, and final Convex writes. Product-context RAG indexing and RAG search
still run inside Convex actions because the Convex RAG component owns that
embedding/index/search behavior.

Web routes wait up to four minutes for a worker result. The shared wait helper
caps larger `BLOG_AI_JOB_ROUTE_WAIT_MS` values and keeps poll delays inside that
deadline, leaving time for the route to respond before its five-minute function
limit. Once a worker is dispatched, the shared poller logs temporary Convex read
problems and returns the queued job status instead of turning a successful
background job into a false request error.
Routes with shorter function limits can provide a smaller wait cap. Image
regeneration waits up to 90 seconds so its 120-second route has time to return.

Signed-in clients can call `GET /api/ai-jobs/[jobId]` to read the status and
result of their own durable jobs. Topic discovery uses this endpoint when its
initial request returns while the worker is still running, because discovery
results are not otherwise saved into a workspace record.

## How It Works

`src/server/blogAiWorker/createBlogAiJob.ts` creates the Convex job and calls
`dispatchBlogAiWorkerJob`, which uses the Google Run API to execute the Cloud
Run Job.

`src/server/blogAiWorker/waitForBlogAiJob.ts` owns server-side polling behavior
for every worker-backed route. It returns the latest job when available and a
queued response after a temporary read failure. The authenticated
`src/app/api/ai-jobs/[jobId]/route.ts` endpoint supports follow-up reads without
exposing job inputs or another user's work.

The Job container starts Next locally, calls
`POST /api/worker/blog-ai/jobs/run`, claims queued work from Convex, parses each
job with `blogAiWorkerJobSchema`, and runs the matching handler:

- `runBlogGenerateWorkerJob`
- `runTopicDiscoverWorkerJob`
- `runTopicBatchPlanWorkerJob`
- `runBlogImageRegenerateWorkerJob`
- `runProductScanWorkerJob`

The Cloud Run image is the normal Next app image built from
`services/blog-ai-worker/Dockerfile`. Set `BLOG_AI_WORKER_ONLY=true` on that
job so every non-worker route returns 404 while the temporary local server is
running inside the job container.

## Environment

Set these on the main web deployment:

```text
BLOG_AI_WORKER_JOB_PROJECT_ID=your-project-id
BLOG_AI_WORKER_JOB_LOCATION=us-central1
BLOG_AI_WORKER_JOB_NAME=blogr-ai-worker
BLOG_AI_WORKER_DISPATCH_CLIENT_EMAIL=blogr-ai-dispatcher@your-project-id.iam.gserviceaccount.com
BLOG_AI_WORKER_DISPATCH_PRIVATE_KEY=service-account-private-key
BLOG_AI_WORKER_SECRET=long-random-shared-secret
BLOG_AI_JOB_ROUTE_WAIT_MS=240000
```

Set these on the Cloud Run worker job:

```text
BLOG_AI_WORKER_SECRET=the-same-long-random-shared-secret
BLOG_AI_WORKER_ONLY=true
BLOG_AI_WORKER_MAX_JOBS=1
NEXT_PUBLIC_CONVEX_URL=https://your-convex-deployment.convex.cloud
REPLICATE_API_TOKEN=...
REPLICATE_WRITER_MODEL=anthropic/claude-sonnet-4.6
REPLICATE_IMAGE_PLANNER_MODEL=openai/gpt-5-mini
REPLICATE_IMAGE_MODEL=google/nano-banana-2
FIRECRAWL_API_KEY=...
APIFY_TOKEN=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_ENDPOINT=...
R2_BUCKET=...
YOUTUBE_API_KEY=optional
EXA_API_KEY=optional
```

Keep these in Convex, not just Cloud Run:

```text
OPENAI_API_KEY=...
R2_TOKEN=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_ENDPOINT=...
R2_BUCKET=...
```

## Google Cloud Setup

Enable the needed services:

```bash
PROJECT_ID=your-project-id
REGION=us-central1
REPOSITORY=blogr

gcloud config set project "$PROJECT_ID"
gcloud services enable \
  artifactregistry.googleapis.com \
  run.googleapis.com \
  secretmanager.googleapis.com
```

Create the Artifact Registry repository once:

```bash
gcloud artifacts repositories create "$REPOSITORY" \
  --repository-format=docker \
  --location "$REGION" \
  --description="Blogr worker images"

gcloud auth configure-docker "$REGION-docker.pkg.dev"
```

Build and push the worker image:

```bash
TAG="$(git rev-parse --short HEAD)"
IMAGE="$REGION-docker.pkg.dev/$PROJECT_ID/$REPOSITORY/blog-ai-worker:$TAG"

docker build --platform linux/amd64 \
  -f services/blog-ai-worker/Dockerfile \
  -t "$IMAGE" \
  .

docker push "$IMAGE"
```

Create secrets in Secret Manager. Use values from your password manager or
local private env file:

```bash
create_or_update_secret() {
  local name="$1"
  local value="$2"

  if gcloud secrets describe "$name" >/dev/null 2>&1; then
    printf "%s" "$value" | gcloud secrets versions add "$name" --data-file=-
  else
    printf "%s" "$value" | gcloud secrets create "$name" \
      --replication-policy=automatic \
      --data-file=-
  fi
}

create_or_update_secret blogr-ai-worker-secret "$BLOG_AI_WORKER_SECRET"
create_or_update_secret blogr-replicate-api-token "$REPLICATE_API_TOKEN"
create_or_update_secret blogr-firecrawl-api-key "$FIRECRAWL_API_KEY"
create_or_update_secret blogr-apify-token "$APIFY_TOKEN"
create_or_update_secret blogr-r2-access-key-id "$R2_ACCESS_KEY_ID"
create_or_update_secret blogr-r2-secret-access-key "$R2_SECRET_ACCESS_KEY"
create_or_update_secret blogr-r2-endpoint "$R2_ENDPOINT"
create_or_update_secret blogr-r2-bucket "$R2_BUCKET"
```

Grant the Cloud Run runtime service account access to those secrets:

```bash
PROJECT_NUMBER="$(gcloud projects describe "$PROJECT_ID" --format="value(projectNumber)")"
WORKER_SERVICE_ACCOUNT="$PROJECT_NUMBER-compute@developer.gserviceaccount.com"

for secret in \
  blogr-ai-worker-secret \
  blogr-replicate-api-token \
  blogr-firecrawl-api-key \
  blogr-apify-token \
  blogr-r2-access-key-id \
  blogr-r2-secret-access-key \
  blogr-r2-endpoint \
  blogr-r2-bucket
do
  gcloud secrets add-iam-policy-binding "$secret" \
    --member "serviceAccount:$WORKER_SERVICE_ACCOUNT" \
    --role roles/secretmanager.secretAccessor
done
```

Create a dispatcher service account and give it permission to execute the job:

```bash
gcloud iam service-accounts create blogr-ai-dispatcher \
  --display-name="Blogr AI worker dispatcher"

DISPATCHER_SERVICE_ACCOUNT="blogr-ai-dispatcher@$PROJECT_ID.iam.gserviceaccount.com"

gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member "serviceAccount:$DISPATCHER_SERVICE_ACCOUNT" \
  --role roles/run.developer

gcloud iam service-accounts keys create blogr-ai-dispatcher-key.json \
  --iam-account "$DISPATCHER_SERVICE_ACCOUNT"
```

Store the JSON key privately. Put its `client_email` into
`BLOG_AI_WORKER_DISPATCH_CLIENT_EMAIL` and its `private_key` into
`BLOG_AI_WORKER_DISPATCH_PRIVATE_KEY` on the web deployment.

Deploy the Cloud Run Job:

```bash
gcloud run jobs deploy blogr-ai-worker \
  --image "$IMAGE" \
  --region "$REGION" \
  --tasks 1 \
  --max-retries 1 \
  --cpu 2 \
  --memory 4Gi \
  --task-timeout 60m \
  --execution-environment gen2 \
  --set-env-vars '^@^BLOG_AI_WORKER_ONLY=true@BLOG_AI_WORKER_MAX_JOBS=1@NEXT_PUBLIC_CONVEX_URL=https://your-convex-deployment.convex.cloud@REPLICATE_WRITER_MODEL=anthropic/claude-sonnet-4.6@REPLICATE_IMAGE_PLANNER_MODEL=openai/gpt-5-mini@REPLICATE_IMAGE_MODEL=google/nano-banana-2' \
  --set-secrets BLOG_AI_WORKER_SECRET=blogr-ai-worker-secret:latest,REPLICATE_API_TOKEN=blogr-replicate-api-token:latest,FIRECRAWL_API_KEY=blogr-firecrawl-api-key:latest,APIFY_TOKEN=blogr-apify-token:latest,R2_ACCESS_KEY_ID=blogr-r2-access-key-id:latest,R2_SECRET_ACCESS_KEY=blogr-r2-secret-access-key:latest,R2_ENDPOINT=blogr-r2-endpoint:latest,R2_BUCKET=blogr-r2-bucket:latest
```

Then set the Cloud Run Job project, region, and name on the web deployment.

Smoke check the deployed job:

```bash
gcloud run jobs execute blogr-ai-worker \
  --region "$REGION" \
  --wait
```

If no Convex `aiJobs` are queued, the job should start, report no claimed work,
and exit successfully.

## Relevant Code

- `src/app/api/worker/blog-ai/route.ts`
- `src/app/api/worker/blog-ai/jobs/run/route.ts`
- `src/server/blogAiWorker/`
- `services/blog-ai-worker/Dockerfile`
- `services/blog-ai-worker/run-job.sh`
- `convex/aiJobs/`
- `src/app/api/blogs/generate/route.ts`
- `src/app/api/topics/discover/route.ts`
- `src/app/api/topics/batch-plan/route.ts`
- `src/app/api/blogs/[blogId]/regenerate-image/route.ts`
- `src/app/api/product/scan/route.ts`
- `src/proxy.ts`

## File Tree

```text
services/blog-ai-worker/
src/app/api/worker/blog-ai/
src/server/blogAiWorker/
convex/aiJobs/
src/server/topics/discoverTopicIdeasForProduct.ts
src/server/topics/planTopicBatch.ts
src/server/product/scanAndStoreProductWebsite.ts
docs/google-cloud-ai-worker.md
```
