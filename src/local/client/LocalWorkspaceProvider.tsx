"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import type { LocalState } from "../domain/LocalState";
import { LocalWorkspaceContext } from "./LocalWorkspaceContext";

export const LocalWorkspaceProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<LocalState>();
  const [startupError, setStartupError] = useState("");
  const stateRef = useRef<LocalState | undefined>(undefined);
  const queue = useRef<Promise<unknown>>(Promise.resolve());
  const refresh = useCallback(async () => {
    const response = await fetch("/api/local/workspace", { cache: "no-store" });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Could not open local work");
    const incoming = data as LocalState;
    if (stateRef.current && incoming.revision < stateRef.current.revision) return stateRef.current;
    stateRef.current = incoming;
    setState(incoming);
    setStartupError("");
    return incoming;
  }, []);
  useEffect(() => { void refresh().catch((error) => { setStartupError(error instanceof Error ? error.message : "Could not open local work."); }); }, [refresh]);
  useEffect(() => { const onFocus = () => { void refresh().catch(() => undefined); }; window.addEventListener("focus", onFocus); return () => window.removeEventListener("focus", onFocus); }, [refresh]);
  const query = useCallback(async (name: string, args: Record<string, unknown> = {}) => {
    const response = await fetch("/api/local/query", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, args }) });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Could not load local work");
    return data.result;
  }, []);
  const mutate = useCallback((name: string, args: Record<string, unknown> = {}) => {
    const operation = queue.current.then(async () => {
      const current = stateRef.current || await refresh();
      const response = await fetch("/api/local/mutation", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, args, expectedRevision: current.revision }) });
      const data = await response.json();
      if (!response.ok) { if (response.status === 409) await refresh(); throw new Error(data.error || "Could not save local work"); }
      stateRef.current = data.state;
      setState(data.state);
      return data.result;
    });
    queue.current = operation.catch(() => undefined);
    return operation;
  }, [refresh]);
  const value = useMemo(() => ({ state, refresh, query, mutate }), [state, refresh, query, mutate]);
  if (startupError && !state) return <main className="mx-auto max-w-xl p-8"><h1 className="text-xl font-semibold">Could not open local work</h1><p className="mt-3 text-sm">{startupError}</p><p className="mt-3 text-sm">Check the workspace folder and restore a backup before editing its files.</p><button className="mt-5 rounded-md border px-4 py-2" onClick={() => { void refresh().catch((error) => setStartupError(String(error))); }} type="button">Try again</button></main>;
  return <LocalWorkspaceContext.Provider value={value}>{children}</LocalWorkspaceContext.Provider>;
};
