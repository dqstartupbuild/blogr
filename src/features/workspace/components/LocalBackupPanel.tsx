"use client";

import { useRef, useState } from "react";
import { Download, Trash2, Upload } from "lucide-react";
import { useLocalWorkspace } from "@/local/client/useLocalWorkspace";
import { LocalConfirmDialog } from "./LocalConfirmDialog";
import { describeBackupImport } from "../utils/describeBackupImport";
import { downloadLocalBackup } from "../utils/downloadLocalBackup";
import { readBackupSummary } from "../utils/readBackupSummary";
import type { BackupSummary } from "../types/BackupSummary";

type PendingAction =
  | { kind: "import"; file: File; summary: BackupSummary }
  | { kind: "delete" };

const primaryButton =
  "inline-flex h-10 items-center gap-2 rounded-md bg-black px-4 text-sm font-medium text-white disabled:opacity-50";
const secondaryButton =
  "inline-flex h-10 items-center gap-2 rounded-md border border-black/20 bg-white px-4 text-sm font-medium text-black disabled:opacity-50";

export const LocalBackupPanel = () => {
  const { state, refresh, mutate } = useLocalWorkspace();
  const input = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [pending, setPending] = useState<PendingAction | null>(null);
  const active = state?.products.find((item) => item.id === state.activeProductId);

  const run = async (task: () => Promise<string>, fallback: string) => {
    setBusy(true);
    setMessage("");
    try {
      setMessage(await task());
    } catch (error) {
      setMessage(error instanceof Error ? error.message : fallback);
    } finally {
      setBusy(false);
    }
  };

  const clearPending = () => {
    setPending(null);
    if (input.current) input.current.value = "";
  };

  const chooseBackupFile = async (file: File) => {
    try {
      setPending({ kind: "import", file, summary: await readBackupSummary(file) });
    } catch (error) {
      clearPending();
      setMessage(error instanceof Error ? error.message : "Could not read this backup.");
    }
  };

  const importBackup = (file: File, summary: BackupSummary) =>
    run(async () => {
      if (!state) throw new Error("Reload the workspace before importing.");
      try {
        const response = await fetch("/api/local/import", {
          body: file,
          headers: {
            "Content-Type": "application/zip",
            "X-Blogr-Revision": String(state.revision),
          },
          method: "POST",
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Could not import this backup.");
        await refresh();
        return summary.scope === "workspace"
          ? `${summary.workspaceNames[0] || "Workspace"} restored.`
          : "Backup imported. Your work is ready.";
      } finally {
        clearPending();
      }
    }, "Could not import this backup.");

  const deleteWorkspace = () =>
    run(async () => {
      if (!active) throw new Error("Pick a workspace first.");
      try {
        await mutate("deleteProductWorkspaceMutation", { productId: active.id });
        return `${active.name} deleted from this computer.`;
      } finally {
        clearPending();
      }
    }, "Could not delete this workspace.");

  const confirmCopy =
    pending?.kind === "import"
      ? describeBackupImport(pending.summary)
      : {
          actionLabel: `Delete ${active?.name || "workspace"}`,
          description: `${active?.name || "This workspace"}, its topics, articles, and saved versions will be removed from this computer. This cannot be undone. Back it up first if you might want it later.`,
          title: `Delete ${active?.name || "workspace"}`,
        };

  return (
    <div className="grid gap-5">
      <section className="rounded-lg border border-black/10 bg-white p-4 shadow-sm">
        <h3 className="text-base font-semibold text-black">Back up</h3>
        <p className="mt-1 text-sm leading-6 text-black/60">
          Your work is saved on this computer. Download a copy to keep it safe or move it to another computer.
        </p>
        <div className="mt-4 grid gap-3">
          {active ? (
            <div className="flex flex-col gap-3 rounded-md border border-black/10 p-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-black">This workspace</p>
                <p className="text-sm leading-6 text-black/60">
                  Only {active.name}: its topics, articles, images, and settings.
                </p>
              </div>
              <button
                className={`${primaryButton} shrink-0`}
                disabled={busy}
                onClick={() => run(async () => { await downloadLocalBackup(active.id); return `${active.name} backed up.`; }, "Could not back up this workspace.")}
                type="button"
              >
                <Download aria-hidden="true" size={16} />
                Back up {active.name}
              </button>
            </div>
          ) : null}
          <div className="flex flex-col gap-3 rounded-md border border-black/10 p-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-black">Entire account</p>
              <p className="text-sm leading-6 text-black/60">
                Every workspace on this computer, all in one file.
              </p>
            </div>
            <button
              className={`${secondaryButton} shrink-0`}
              disabled={busy}
              onClick={() => run(async () => { await downloadLocalBackup(); return "Everything backed up."; }, "Could not back up your work.")}
              type="button"
            >
              <Download aria-hidden="true" size={16} />
              Back up everything
            </button>
          </div>
        </div>
      </section>
      <section className="rounded-lg border border-black/10 bg-white p-4 shadow-sm">
        <h3 className="text-base font-semibold text-black">Restore</h3>
        <p className="mt-1 text-sm leading-6 text-black/60">
          Import a workspace or account backup. You&apos;ll see what it contains before anything changes.
        </p>
        <button
          className={`${secondaryButton} mt-4`}
          disabled={busy}
          onClick={() => input.current?.click()}
          type="button"
        >
          <Upload aria-hidden="true" size={16} />
          Import backup
        </button>
        <input
          accept=".zip,application/zip"
          className="sr-only"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void chooseBackupFile(file);
          }}
          ref={input}
          type="file"
        />
      </section>
      {active ? (
        <section className="rounded-lg border border-red-200 bg-white p-4 shadow-sm">
          <h3 className="text-base font-semibold text-red-800">Delete workspace</h3>
          <p className="mt-1 text-sm leading-6 text-black/60">
            Permanently remove {active.name} from this computer.
          </p>
          <button
            className="mt-4 inline-flex h-10 items-center gap-2 rounded-md border border-red-300 px-4 text-sm font-medium text-red-700 disabled:opacity-50"
            disabled={busy}
            onClick={() => setPending({ kind: "delete" })}
            type="button"
          >
            <Trash2 aria-hidden="true" size={16} />
            Delete {active.name}
          </button>
        </section>
      ) : null}
      {message ? <p aria-live="polite" className="text-sm text-black/70">{message}</p> : null}
      {pending ? (
        <LocalConfirmDialog
          actionLabel={confirmCopy.actionLabel}
          busy={busy}
          description={confirmCopy.description}
          onCancel={clearPending}
          onConfirm={() => {
            if (pending.kind === "import") void importBackup(pending.file, pending.summary);
            else void deleteWorkspace();
          }}
          title={confirmCopy.title}
        />
      ) : null}
    </div>
  );
};
