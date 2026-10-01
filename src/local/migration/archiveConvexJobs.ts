import type { ConvexTables } from "./ConvexRecord";
import type { LocalMediaEntry } from "./buildMediaMap";
import type { MediaManifestEntry } from "./MediaManifestEntry";
import { sanitizeJobValue } from "./sanitizeJobValue";
import { stableLocalId } from "./stableLocalId";

export const archiveConvexJobs = (tables: ConvexTables, ownerId: string, media: LocalMediaEntry[], manifest: MediaManifestEntry[]) => tables.aiJobs
  .filter((job) => job.userId === ownerId)
  .map((job) => ({
    id: stableLocalId("aiJobs", job._id), type: job.type, status: job.status,
    productId: typeof job.productId === "string" ? stableLocalId("products", job.productId) : undefined,
    topicId: typeof job.topicId === "string" ? stableLocalId("topics", job.topicId) : undefined,
    blogId: typeof job.blogId === "string" ? stableLocalId("blogs", job.blogId) : undefined,
    attempts: job.attempts, createdAt: job.createdAt, updatedAt: job.updatedAt,
    completedAt: job.completedAt, error: sanitizeJobValue(job.error, media, manifest, ownerId),
    input: sanitizeJobValue(job.input, media, manifest, ownerId), result: sanitizeJobValue(job.result, media, manifest, ownerId),
  }));
