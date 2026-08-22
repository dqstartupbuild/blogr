#!/bin/sh
set -eu

PORT="${PORT:-3000}"
MAX_JOBS="${BLOG_AI_WORKER_MAX_JOBS:-1}"

npm run start -- --port "$PORT" &
SERVER_PID="$!"

cleanup() {
  kill "$SERVER_PID" >/dev/null 2>&1 || true
}

trap cleanup EXIT INT TERM

for _ in 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20; do
  if curl -fsS "http://127.0.0.1:$PORT/api/worker/blog-ai" \
    -H "x-blog-ai-worker-secret: $BLOG_AI_WORKER_SECRET" >/dev/null; then
    break
  fi

  sleep 1
done

curl -fsS "http://127.0.0.1:$PORT/api/worker/blog-ai/jobs/run" \
  -H "content-type: application/json" \
  -H "x-blog-ai-worker-secret: $BLOG_AI_WORKER_SECRET" \
  --data "{\"maxJobs\":$MAX_JOBS}"
