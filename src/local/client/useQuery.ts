"use client";

import { useMemo } from "react";
import { queryLocalState } from "./queryLocalState";
import { useLocalWorkspace } from "./useLocalWorkspace";
import type { LocalQueryName, LocalQueryResults } from "./LocalQueryResults";

export function useQuery<N extends LocalQueryName>(name: N, args?: Record<string, unknown> | "skip"): LocalQueryResults[N] | undefined;
export function useQuery<T>(name: LocalQueryName, args?: Record<string, unknown> | "skip"): T | undefined;
export function useQuery(name: LocalQueryName, args: Record<string, unknown> | "skip" = {}): unknown {
  const { state } = useLocalWorkspace();
  const argsKey = args === "skip" ? "skip" : JSON.stringify(args);
  return useMemo(() => state && argsKey !== "skip" ? queryLocalState(state, name, JSON.parse(argsKey)) : undefined, [state, name, argsKey]);
}
