import { randomUUID } from "node:crypto";
import { mkdir, writeFile, unlink } from "node:fs/promises";
import { join } from "node:path";
import JSZip from "jszip";
import { z } from "zod";
import { detectRasterImageFormat } from "../../../shared/raster/detectRasterImageFormat";
import { localStateSchema } from "../domain/localStateSchema";
import { getLocalHome } from "./getLocalHome";
import { listReferencedMedia } from "./listReferencedMedia";
import { mergeWorkspaceBackup } from "./mergeWorkspaceBackup";
import { updateLocalState } from "./updateLocalState";
import { readLimitedZipEntry } from "./readLimitedZipEntry";
const exportSchema = z.object({ format: z.literal("blogr-export"), version: z.literal(1), scope: z.enum(["account", "workspace"]).default("account"), workspace: localStateSchema });
export const importLocalExport = async (bytes: ArrayBuffer, expectedRevision: number) => {
  const zip = await JSZip.loadAsync(bytes, { checkCRC32: false });
  const entries = Object.values(zip.files);
  if (entries.length > 1002 || entries.some((item) => item.name.includes("..") || item.name.startsWith("/") || !(item.dir && item.name === "media/") && !/^(workspace\.json|media\/[a-f0-9-]{36}\.(png|jpg|webp|gif))$/.test(item.name))) throw new Error("Backup contains unsupported files.");
  const workspaceFile = zip.file("workspace.json");
  if (!workspaceFile) throw new Error("This backup has no workspace.json file.");
  const workspaceBytes = await readLimitedZipEntry(workspaceFile, 20 * 1024 * 1024);
  if (workspaceBytes.length > 20 * 1024 * 1024) throw new Error("Backup workspace is larger than 20 MB.");
  const input = exportSchema.parse(JSON.parse(workspaceBytes.toString("utf8")));
  const referenced = listReferencedMedia(input.workspace as Parameters<typeof listReferencedMedia>[0]);
  if (referenced.length > 1000) throw new Error("Backup has too many images.");
  const media: Array<{ name: string; value: Buffer }> = [];
  let expandedSize = workspaceBytes.length;
  let serialized = JSON.stringify(input.workspace);
  for (const oldName of referenced) {
    const item = zip.file(`media/${oldName}`);
    if (!item) throw new Error(`This backup is missing ${oldName}.`);
    const value = await readLimitedZipEntry(item, Math.min(20 * 1024 * 1024, 600 * 1024 * 1024 - expandedSize));
    expandedSize += value.length;
    if (value.length > 20 * 1024 * 1024 || expandedSize > 600 * 1024 * 1024) throw new Error("Backup expands beyond 600 MB.");
    const detected = detectRasterImageFormat(value);
    if (!detected) throw new Error("Backup contains an unsupported image.");
    const ext = detected.contentType === "image/png" ? "png" : detected.contentType === "image/webp" ? "webp" : detected.contentType === "image/gif" ? "gif" : "jpg";
    const name = `${randomUUID()}.${ext}`;
    serialized = serialized.split(`/api/local/media/${oldName}`).join(`/api/local/media/${name}`);
    media.push({ name, value });
  }
  const next = localStateSchema.parse(JSON.parse(serialized));
  try { return await updateLocalState(expectedRevision, async (state) => {
    const directory = join(getLocalHome(), "media");
    await mkdir(directory, { recursive: true, mode: 0o700 });
    for (const item of media) await writeFile(join(directory, item.name), item.value, { flag: "wx", mode: 0o600 });
    if (input.scope === "workspace") {
      const merged = mergeWorkspaceBackup(state, next as typeof state);
      return { importedProducts: 1, scope: input.scope, ...merged };
    }
    state.activeProductId = next.activeProductId;
    state.products = next.products as typeof state.products;
    state.topics = next.topics as typeof state.topics;
    state.blogs = next.blogs as typeof state.blogs;
    state.blogVersions = next.blogVersions as typeof state.blogVersions;
    return { importedProducts: state.products.length, scope: input.scope };
  }); } catch (error) {
    const { readLocalState } = await import("./readLocalState");
    const committed = await readLocalState().then((state) => new Set(listReferencedMedia(state))).catch(() => new Set<string>());
    for (const item of media) if (!committed.has(item.name)) await unlink(join(getLocalHome(), "media", item.name)).catch(() => undefined);
    throw error;
  }
};
