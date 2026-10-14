import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ZodError } from "zod";
import { emptyLocalState } from "../domain/emptyLocalState";
import { migrateLocalState } from "../domain/migrateLocalState";
import type { LocalState } from "../domain/LocalState";
import { getLocalHome } from "./getLocalHome";

export const readLocalState = async (): Promise<LocalState> => {
  let contents: string;
  try {
    contents = await readFile(join(getLocalHome(), "workspace.json"), "utf8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return emptyLocalState();
    throw error;
  }
  try {
    return migrateLocalState(JSON.parse(contents));
  } catch (error) {
    if (error instanceof SyntaxError || error instanceof ZodError) {
      throw new Error("Saved work could not be read. Restore a backup or repair workspace.json.");
    }
    throw error;
  }
};
