import { homedir, tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { getRuntimeMode } from "./getRuntimeMode";

export const getLocalHome = () => {
  const mode = getRuntimeMode();
  if (mode === "test") {
    if (!process.env.BLOGR_HOME) throw new Error("BLOGR_HOME is required in test mode");
    const home = resolve(process.env.BLOGR_HOME);
    if (home === tmpdir()) throw new Error("Use a dedicated test directory");
    return home;
  }
  return resolve(process.env.BLOGR_HOME || join(homedir(), ".blogr"));
};
