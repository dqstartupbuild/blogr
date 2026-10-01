import { realpath } from "node:fs/promises";
import { dirname, isAbsolute, relative, resolve, sep } from "node:path";

export const resolveManifestFile = async (manifestPath: string, file: string): Promise<string> => {
  if (isAbsolute(file)) throw new Error("Media manifest files must use relative paths.");
  const base = dirname(resolve(manifestPath));
  const path = resolve(base, file);
  const within = relative(base, path);
  if (!within || within === ".." || within.startsWith(`..${sep}`) || isAbsolute(within)) throw new Error("Media manifest file escapes its directory.");
  const realBase = await realpath(base);
  const realFile = await realpath(path);
  const realWithin = relative(realBase, realFile);
  if (!realWithin || realWithin === ".." || realWithin.startsWith(`..${sep}`) || isAbsolute(realWithin)) throw new Error("Media manifest file resolves outside its directory.");
  return realFile;
};
