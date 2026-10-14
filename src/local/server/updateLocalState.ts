import type { LocalState } from "../domain/LocalState";
import { readLocalState } from "./readLocalState";
import { writeLocalState } from "./writeLocalState";
import { withStoreLock } from "./withStoreLock";
import { listReferencedMedia } from "./listReferencedMedia";
import { getLocalHome } from "./getLocalHome";
import { join } from "node:path";
import { unlink } from "node:fs/promises";

let pending: Promise<unknown> = Promise.resolve();

export const updateLocalState = async <T>(
  expectedRevision: number,
  change: (state: LocalState) => T | Promise<T>,
): Promise<{ result: T; state: LocalState }> => {
  const operation = pending.then(() => withStoreLock(async () => {
    const state = await readLocalState();
    if (state.revision !== expectedRevision) throw new Error("This workspace changed. Reload it before saving.");
    const next = structuredClone(state);
    const result = await change(next);
    next.revision++;
    const saved = await writeLocalState(next);
    const retained = new Set(listReferencedMedia(saved));
    for (const name of listReferencedMedia(state)) {
      if (!retained.has(name)) await unlink(join(getLocalHome(), "media", name)).catch(() => undefined);
    }
    return { result, state: saved };
  }));
  pending = operation.catch(() => undefined);
  return operation;
};
