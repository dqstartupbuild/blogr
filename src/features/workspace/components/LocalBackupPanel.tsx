"use client";
import { useRef, useState } from "react";
import { useLocalWorkspace } from "@/local/client/useLocalWorkspace";
import { LocalConfirmDialog } from "./LocalConfirmDialog";

export const LocalBackupPanel = () => {
  const { state, refresh, mutate } = useLocalWorkspace();
  const input = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [pending, setPending] = useState<"import" | "delete" | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const active = state?.products.find((item) => item.id === state.activeProductId);
  const download = async () => {
    setBusy(true); setMessage("");
    try {
      const response = await fetch("/api/local/export", { cache: "no-store" });
      if (!response.ok) throw new Error("Could not export your work.");
      const url = URL.createObjectURL(await response.blob());
      const anchor = document.createElement("a"); anchor.href = url; anchor.download = "blogr-backup.zip"; anchor.click(); URL.revokeObjectURL(url);
      setMessage("Backup downloaded.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Could not export your work."); }
    finally { setBusy(false); }
  };
  const importBackup = async (file: File) => {
    if (!state) return;
    setBusy(true); setMessage("");
    try {
      const response = await fetch("/api/local/import", { method: "POST", headers: { "Content-Type": "application/zip", "X-Blogr-Revision": String(state.revision) }, body: file });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not import this backup.");
      await refresh(); setMessage("Backup imported. Your work is ready.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Could not import this backup."); }
    finally { setBusy(false); setPending(null); setPendingFile(null); if (input.current) input.current.value = ""; }
  };
  const deleteWorkspace = async () => {
    if (!active) return;
    setBusy(true); setMessage("");
    try { await mutate("deleteProductWorkspaceMutation", { productId: active.id }); setMessage(`${active.name} deleted from this computer.`); }
    catch (error) { setMessage(error instanceof Error ? error.message : "Could not delete this workspace."); }
    finally { setBusy(false); setPending(null); }
  };
  return <section className="rounded-lg border border-black/10 bg-white p-4 shadow-sm">
    <h2 className="text-lg font-semibold text-black">Local work and backups</h2>
    <p className="mt-2 text-sm text-black/65">Your work is saved on this computer. Download a backup to keep a copy of your projects and images.</p>
    <div className="mt-4 flex flex-wrap gap-3">
      <button className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50" disabled={busy} onClick={download} type="button">Download backup</button>
      <button className="rounded-md border border-black/20 px-4 py-2 text-sm font-medium text-black disabled:opacity-50" disabled={busy} onClick={() => input.current?.click()} type="button">Import backup</button>
      <input accept=".zip,application/zip" className="sr-only" onChange={(event) => { const file = event.target.files?.[0]; if (file) { setPendingFile(file); setPending("import"); } }} ref={input} type="file" />
      {active ? <button className="rounded-md border border-red-300 px-4 py-2 text-sm font-medium text-red-700 disabled:opacity-50" disabled={busy} onClick={() => setPending("delete")} type="button">Delete {active.name}</button> : null}
    </div>
    {message ? <p aria-live="polite" className="mt-3 text-sm text-black/70">{message}</p> : null}
    {pending ? <LocalConfirmDialog actionLabel={pending === "import" ? "Replace local work" : `Delete ${active?.name || "workspace"}`} busy={busy} description={pending === "import" ? "This backup will replace every project, topic, article, and image saved on this computer. Download a backup first if you want to keep your current work." : `${active?.name || "This workspace"}, its topics, articles, and saved versions will be removed from this computer. This cannot be undone.`} onCancel={() => { setPending(null); setPendingFile(null); if (input.current) input.current.value = ""; }} onConfirm={() => { if (pending === "import" && pendingFile) void importBackup(pendingFile); else if (pending === "delete") void deleteWorkspace(); }} title={pending === "import" ? "Replace local work" : `Delete ${active?.name || "workspace"}`} /> : null}
  </section>;
};
