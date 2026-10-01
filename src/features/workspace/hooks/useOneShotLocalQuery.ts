"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocalWorkspace } from "@/local/client/useLocalWorkspace";

// The list controls request a fresh page when their filters or cursor change.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useOneShotLocalQuery = <T = any>(name: string, args: Record<string, unknown> | "skip", refreshKey: number) => {
  const { query } = useLocalWorkspace();
  const [response, setResponse] = useState<{ key: string; result?: T }>();
  const argsKey = useMemo(() => args === "skip" ? "skip" : JSON.stringify(args), [args]);
  const key = `${name}:${argsKey}:${refreshKey}`;
  useEffect(() => {
    if (argsKey === "skip") return;
    let active = true;
    void query(name, JSON.parse(argsKey)).then((value) => { if (active) setResponse({ key, result: value as T }); }).catch(() => { if (active) setResponse({ key }); });
    return () => { active = false; };
  }, [name, argsKey, key, query]);
  return { result: argsKey === "skip" || response?.key !== key ? undefined : response.result, isLoading: argsKey !== "skip" && response?.key !== key };
};
