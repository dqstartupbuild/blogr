"use client";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
export const LocalConfirmDialog = ({ title, description, actionLabel, busy, onConfirm, onCancel }: { title: string; description: string; actionLabel: string; busy: boolean; onConfirm: () => void; onCancel: () => void }) => {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);
  useEffect(() => { cancelRef.current?.focus(); }, []);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !busy) onCancel();
      if (event.key === "Tab") {
        const first = cancelRef.current;
        const last = confirmRef.current;
        if (!first || !last) return;
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [busy, onCancel]);
  if (typeof document === "undefined") return null;
  return createPortal(<div className="fixed inset-0 z-[9999] grid place-items-center bg-black/50 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget && !busy) onCancel(); }}>
    <section aria-describedby="local-confirm-description" aria-labelledby="local-confirm-title" aria-modal="true" className="w-full max-w-md rounded-lg bg-white p-6 text-black" role="dialog">
      <h2 className="text-lg font-semibold" id="local-confirm-title">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-black/70" id="local-confirm-description">{description}</p>
      <div className="mt-6 flex flex-wrap justify-end gap-3">
        <button className="rounded-md border border-black/20 px-4 py-2 text-sm font-medium" disabled={busy} onClick={onCancel} ref={cancelRef} type="button">Keep current work</button>
        <button className="rounded-md bg-red-700 px-4 py-2 text-sm font-medium text-white disabled:opacity-50" disabled={busy} onClick={onConfirm} ref={confirmRef} type="button">{busy ? "Working" : actionLabel}</button>
      </div>
    </section>
  </div>, document.body);
};
