import { mkdir, open, readFile, unlink } from "node:fs/promises";
import { join } from "node:path";
import { getLocalHome } from "./getLocalHome";

export const withStoreLock = async <T>(work: () => Promise<T>): Promise<T> => {
  const directory = getLocalHome();
  await mkdir(directory, { recursive: true, mode: 0o700 });
  const path = join(directory, ".workspace.lock");
  let handle;
  for (let attempt = 0; attempt < 100; attempt++) {
    try {
      handle = await open(path, "wx", 0o600);
      await handle.writeFile(String(process.pid));
      await handle.sync();
      break;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error;
      const owner = Number(await readFile(path, "utf8").catch(() => ""));
      if (owner > 0) {
        try { process.kill(owner, 0); }
        catch (checkError) { if ((checkError as NodeJS.ErrnoException).code === "ESRCH") await unlink(path).catch(() => undefined); }
      }
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }
  if (!handle) throw new Error("Local workspace is busy. Try again.");
  try { return await work(); }
  finally { await handle.close(); await unlink(path).catch(() => undefined); }
};
