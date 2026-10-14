import type { LocalBackupScope } from "@/local/domain/LocalBackupScope";

export type BackupSummary = {
  scope: LocalBackupScope;
  workspaceNames: string[];
};
