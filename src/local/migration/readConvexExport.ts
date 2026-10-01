import { readFile, stat } from "node:fs/promises";
import { join } from "node:path";
import JSZip from "jszip";
import type { ConvexTables } from "./ConvexRecord";
import { readConvexTable } from "./readConvexTable";

export const readConvexExport = async (inputPath: string): Promise<ConvexTables> => {
  const names = ["products", "topics", "blogs", "blogVersions", "aiJobs", "workspaceSelections"] as const;
  const isDirectory = (await stat(inputPath)).isDirectory();
  const zip = isDirectory ? null : await JSZip.loadAsync(await readFile(inputPath));
  const result = {} as ConvexTables;
  for (const name of names) {
    const path = `${name}/documents.jsonl`;
    const file = zip?.file(path);
    if (zip && !file) {
      if (name === "aiJobs" || name === "workspaceSelections") { result[name] = []; continue; }
      throw new Error(`Export is missing ${path}.`);
    }
    const bytes = zip ? await file!.async("nodebuffer") : await readFile(join(inputPath, path)).catch(async (error: NodeJS.ErrnoException) => {
      if (error.code !== "ENOENT") throw error;
      return readFile(join(inputPath, `${name}.jsonl`)).catch((flatError: NodeJS.ErrnoException) => {
        if (flatError.code === "ENOENT" && (name === "aiJobs" || name === "workspaceSelections")) return Buffer.alloc(0);
        throw flatError;
      });
    });
    if (bytes.length > 100 * 1024 * 1024) throw new Error(`${path} exceeds 100 MB.`);
    result[name] = readConvexTable(bytes.toString("utf8"), name);
  }
  return result;
};
