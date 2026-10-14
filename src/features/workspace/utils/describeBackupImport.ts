import type { BackupSummary } from "../types/BackupSummary";

export const describeBackupImport = ({ scope, workspaceNames }: BackupSummary) => {
  if (scope === "workspace") {
    const name = workspaceNames[0] || "this workspace";

    return {
      actionLabel: `Restore ${name}`,
      description: `This is a backup of ${name}. It will be added to this computer. If ${name} is already here, its topics, articles, and settings will be replaced with the backup. Your other workspaces won't change.`,
      title: `Restore ${name}`,
    };
  }

  const count = workspaceNames.length;

  return {
    actionLabel: "Replace everything",
    description: `This is a full account backup with ${count} ${count === 1 ? "workspace" : "workspaces"}. It will replace every workspace, topic, article, and image saved on this computer. Back up your current work first if you want to keep it.`,
    title: "Replace all local work",
  };
};
