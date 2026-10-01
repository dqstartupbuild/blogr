import { collectReferencedR2Keys } from "./collectReferencedR2Keys";
import { buildMediaMap } from "./buildMediaMap";
import { readConvexExport } from "./readConvexExport";
import { readMediaManifest } from "./readMediaManifest";
import { mapConvexWorkspace } from "./mapConvexWorkspace";
import { rewriteWorkspaceMedia } from "./rewriteWorkspaceMedia";
import { archiveConvexJobs } from "./archiveConvexJobs";
import { stableLocalId } from "./stableLocalId";
import { writeMigrationStage } from "./writeMigrationStage";
import { getOwnerR2Prefix } from "./getOwnerR2Prefix";

export type MigrationOptions = { input: string; mediaManifest: string; output: string; ownerId: string };

export const runConvexMigration = async (options: MigrationOptions) => {
  const tables = await readConvexExport(options.input);
  const state = mapConvexWorkspace(tables, options.ownerId);
  const manifest = await readMediaManifest(options.mediaManifest);
  const keys = collectReferencedR2Keys(tables, options.ownerId);
  const ownerPrefix = getOwnerR2Prefix(options.ownerId);
  const selectedKeys = new Set(manifest.map((item) => item.r2Key).filter((key) => keys.has(key) || key.startsWith(ownerPrefix)));
  const allMedia = await buildMediaMap(selectedKeys, manifest, options.mediaManifest);
  const media = allMedia.filter((item) => keys.has(item.r2Key));
  const archivedMedia = allMedia.filter((item) => !keys.has(item.r2Key));
  if (media.length !== keys.size) throw new Error("Media manifest does not cover every referenced R2 image.");
  const rewritten = rewriteWorkspaceMedia(state, media, manifest);
  const jobs = archiveConvexJobs(tables, options.ownerId, media, manifest);
  const report = {
    format: "blogr-convex-migration-report", version: 1,
    counts: { products: rewritten.products.length, topics: rewritten.topics.length, blogs: rewritten.blogs.length, blogVersions: rewritten.blogVersions.length, aiJobsArchived: jobs.length, media: media.length, unreferencedMediaArchived: archivedMedia.length },
    mediaBytes: media.reduce((sum, item) => sum + item.bytes.length, 0),
    archivedMediaBytes: archivedMedia.reduce((sum, item) => sum + item.bytes.length, 0),
    foreignUnreferencedMediaSkipped: new Set(manifest.map((item) => item.r2Key).filter((key) => !keys.has(key) && !key.startsWith(ownerPrefix))).size,
    unresolvedExternalImageReferences: (JSON.stringify(rewritten).match(/r2-key:/g) || []).length,
    productIdMap: Object.fromEntries(tables.products.filter((item) => item.userId === options.ownerId).map((item) => [item._id, stableLocalId("products", item._id)])),
  };
  await writeMigrationStage(options.output, rewritten, media, archivedMedia, ownerPrefix, jobs, report);
  return report;
};
