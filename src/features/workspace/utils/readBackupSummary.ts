import JSZip from "jszip";
import type { LocalBackupScope } from "@/local/domain/LocalBackupScope";
import type { BackupSummary } from "../types/BackupSummary";

// Peeks inside a backup so the import confirmation can say what it will do.
export const readBackupSummary = async (file: File): Promise<BackupSummary> => {
  const zip = await JSZip.loadAsync(file);
  const manifest = await zip.file("workspace.json")?.async("string");
  if (!manifest) throw new Error("This file isn't a Blogr backup.");

  const parsed = JSON.parse(manifest) as {
    scope?: LocalBackupScope;
    workspace?: { products?: { name?: string }[] };
  };

  return {
    scope: parsed.scope === "workspace" ? "workspace" : "account",
    workspaceNames: (parsed.workspace?.products || []).map(
      (product) => product.name || "Untitled workspace",
    ),
  };
};
