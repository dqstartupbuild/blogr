import { mkdir, open, rename, unlink } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { join } from "node:path";
import { localStateSchema } from "../domain/localStateSchema";
import type { LocalState } from "../domain/LocalState";
import { getLocalHome } from "./getLocalHome";

export const writeLocalState = async (state: LocalState, openFile: typeof open = open): Promise<LocalState> => {
  const validated = localStateSchema.parse({
    ...state,
    products: state.products.map((product) => product.blogPublishingIntegration ? {
      ...product,
      blogPublishingIntegration: { ...product.blogPublishingIntegration, hasAccessToken: false },
    } : product),
  });
  const directory = getLocalHome();
  await mkdir(directory, { recursive: true, mode: 0o700 });
  const temporaryPath = join(directory, `.workspace.${randomUUID()}.tmp`);
  const targetPath = join(directory, "workspace.json");
  let handle;
  try {
    handle = await openFile(temporaryPath, "wx", 0o600);
    await handle.writeFile(JSON.stringify(validated, null, 2));
    await handle.sync();
    await handle.close();
    handle = undefined;
    await rename(temporaryPath, targetPath);
    const directoryHandle = await open(directory, "r");
    try { await directoryHandle.sync(); } finally { await directoryHandle.close(); }
    return validated as unknown as LocalState;
  } catch (error) {
    if (handle) await handle.close().catch(() => undefined);
    await unlink(temporaryPath).catch(() => undefined);
    throw error;
  }
};
