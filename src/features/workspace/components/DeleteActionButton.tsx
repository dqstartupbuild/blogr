"use client";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { LocalConfirmDialog } from "./LocalConfirmDialog";
export const DeleteActionButton = ({ confirmMessage, label, onDelete }: { confirmMessage: string; label: string; onDelete: () => Promise<void> | void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const handleDelete = async () => {
    setIsDeleting(true); setError("");
    try { await onDelete(); setIsOpen(false); }
    catch (caught) { setError(caught instanceof Error ? caught.message : "Could not delete yet."); }
    finally { setIsDeleting(false); }
  };
  return <>
    <button className="inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-md border border-black/15 bg-white px-4 text-sm font-semibold text-black shadow-sm transition hover:border-black hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-60" disabled={isDeleting} onClick={() => setIsOpen(true)} type="button"><Trash2 size={16} aria-hidden="true" />{isDeleting ? "Deleting" : label}</button>
    {isOpen ? <LocalConfirmDialog actionLabel={label} busy={isDeleting} description={error || confirmMessage} onCancel={() => setIsOpen(false)} onConfirm={() => { void handleDelete(); }} title={label} /> : null}
  </>;
};
