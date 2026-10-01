import { readFile } from "node:fs/promises";
import { join } from "node:path";
import JSZip from "jszip";
import { localStateSchema } from "../domain/localStateSchema";
import type { LocalState } from "../domain/LocalState";
import { getLocalHome } from "./getLocalHome";
import { listReferencedMedia } from "./listReferencedMedia";
export const buildLocalExport = async (state: LocalState) => {
  const zip = new JSZip();
  zip.file("workspace.json", JSON.stringify({ format: "blogr-export", version: 1, workspace: localStateSchema.parse(state) }, null, 2));
  for (const name of listReferencedMedia(state)) zip.file(`media/${name}`, await readFile(join(getLocalHome(), "media", name)));
  return zip.generateAsync({ type: "arraybuffer", compression: "DEFLATE" });
};
