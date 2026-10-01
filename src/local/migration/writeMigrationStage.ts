import { mkdir, open, rm } from "node:fs/promises";
import { dirname, join, relative, resolve, sep } from "node:path";
import type { LocalState } from "../domain/LocalState";
import type { LocalMediaEntry } from "./buildMediaMap";

const writeSynced = async (path: string, value: string | Buffer) => {
  const handle = await open(path, "wx", 0o600);
  try { await handle.writeFile(value); await handle.sync(); }
  finally { await handle.close(); }
};

export const writeMigrationStage = async (outputPath: string, state: LocalState, media: LocalMediaEntry[], archivedMedia: LocalMediaEntry[], ownerPrefix: string, jobs: unknown[], report: unknown) => {
  const path = resolve(outputPath);
  const repository = resolve(process.cwd());
  const insideRepository = relative(repository, path);
  if (!insideRepository || (!insideRepository.startsWith(`..${sep}`) && insideRepository !== "..")) throw new Error("Choose a staging directory outside the repository.");
  await mkdir(dirname(path), { recursive: true, mode: 0o700 });
  await mkdir(path, { mode: 0o700 });
  try {
    await mkdir(join(path, "media"), { mode: 0o700 });
    await mkdir(join(path, "archive"), { mode: 0o700 });
    await mkdir(join(path, "archive", "unreferenced-media"), { mode: 0o700 });
    for (const item of media) await writeSynced(join(path, "media", item.name), item.bytes);
    for (const item of archivedMedia) await writeSynced(join(path, "archive", "unreferenced-media", item.name), item.bytes);
    await writeSynced(join(path, "archive", "unreferenced-media-manifest.json"), JSON.stringify(archivedMedia.map(({ r2Key, name }) => ({ sourceKeySuffix: r2Key.slice(ownerPrefix.length), file: `unreferenced-media/${name}` })), null, 2));
    await writeSynced(join(path, "archive", "ai-jobs.json"), JSON.stringify({ format: "blogr-ai-job-archive", version: 1, jobs }, null, 2));
    await writeSynced(join(path, "migration-report.json"), JSON.stringify(report, null, 2));
    await writeSynced(join(path, "workspace.json"), JSON.stringify(state, null, 2));
    const handle = await open(path, "r");
    try { await handle.sync(); } finally { await handle.close(); }
  } catch (error) {
    await rm(path, { recursive: true, force: true });
    throw error;
  }
};
