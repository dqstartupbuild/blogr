import { unlink } from "node:fs/promises";
import { join } from "node:path";
import { getLocalHome } from "./getLocalHome";
import { listReferencedMedia } from "./listReferencedMedia";
import { mediaScope } from "./mediaScope";
import { readLocalState } from "./readLocalState";
import { withStoreLock } from "./withStoreLock";

export const withManagedMediaScope = async <T>(operation: () => Promise<T>): Promise<T> => mediaScope.run(new Set<string>(), async () => {
  try { return await operation(); }
  finally {
    const created = mediaScope.getStore();
    if (created?.size) {
      await withStoreLock(async () => {
        const retained = new Set(listReferencedMedia(await readLocalState()));
        for (const name of created) if (!retained.has(name)) await unlink(join(getLocalHome(), "media", name)).catch(() => undefined);
      }).catch(() => undefined);
    }
  }
});
