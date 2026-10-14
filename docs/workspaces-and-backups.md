# Workspaces and backups

A workspace holds one product and its settings, topics, calendar, articles, and images. Switch or create workspaces from the sidebar. Everything you see belongs to the active workspace.

## Back up

Open **Settings → Backups**.

- **Back up this workspace** downloads just the active workspace (`blogr-<name>-backup.zip`).
- **Back up everything** downloads every workspace on this computer (`blogr-backup.zip`).

A backup is a ZIP with `workspace.json` and the images it uses. It never includes API keys. The manifest records `scope: "workspace"` or `"account"`.

## Restore

**Import backup** reads the file first, then asks you to confirm what will happen:

- **A workspace backup** adds that workspace. If it's already on this computer, its topics, articles, and settings are replaced with the backup. Other workspaces don't change, and the restored workspace becomes active.
- **An account backup** replaces every workspace on this computer. Older backups without a scope count as account backups.

Imports are fully checked before anything changes. Limits: a 512 MB ZIP, 600 MB of unpacked files, up to 1000 images, and 20 MB per image. Imported images get new file names.

## Delete

**Delete workspace** permanently removes the active workspace and its topics, articles, and versions. Back it up first if you might want it later. Deleting an article also deletes its versions. Deleting a topic keeps its article.

Relevant code: `src/features/workspace/components/LocalBackupPanel.tsx`, `src/app/api/local/export/route.ts`, `src/local/server/importLocalExport.ts`, and `src/local/server/mergeWorkspaceBackup.ts`.
