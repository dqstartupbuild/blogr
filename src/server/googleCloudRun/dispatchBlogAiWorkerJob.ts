import { getGoogleCloudRunAccessToken } from "./getGoogleCloudRunAccessToken";
import { getRequiredGoogleCloudRunEnv } from "./getRequiredGoogleCloudRunEnv";

type CloudRunJobRunResponse = {
  name?: unknown;
};

export const dispatchBlogAiWorkerJob = async () => {
  const projectId = getRequiredGoogleCloudRunEnv("BLOG_AI_WORKER_JOB_PROJECT_ID");
  const location = getRequiredGoogleCloudRunEnv("BLOG_AI_WORKER_JOB_LOCATION");
  const jobName = getRequiredGoogleCloudRunEnv("BLOG_AI_WORKER_JOB_NAME");
  const token = await getGoogleCloudRunAccessToken();
  const response = await fetch(
    `https://run.googleapis.com/v2/projects/${projectId}/locations/${location}/jobs/${jobName}:run`,
    {
      body: "{}",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "POST",
    },
  );
  const body = (await response.json()) as CloudRunJobRunResponse;

  if (!response.ok) {
    throw new Error("Cloud Run AI worker dispatch failed.");
  }

  return {
    executionName: typeof body.name === "string" ? body.name : null,
  };
};
