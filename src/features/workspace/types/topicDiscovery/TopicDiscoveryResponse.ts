import type { TopicDiscoveryResult } from "./TopicDiscoveryResult";

export type TopicDiscoveryResponse = {
  discovery?: TopicDiscoveryResult;
  error?: string;
  jobId?: string;
  status?: "queued" | "running" | "succeeded" | "failed";
};
