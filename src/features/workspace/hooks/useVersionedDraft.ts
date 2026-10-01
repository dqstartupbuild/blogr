"use client";
import { useCallback, useMemo, useState } from "react";
import type { SetStateAction } from "react";

type DraftState<T> = { baseline: T; baseVersion: number; draft: T };

export const useVersionedDraft = <T,>(incoming: T, version: number) => {
  const incomingKey = JSON.stringify(incoming);
  const stableIncoming = useMemo(() => JSON.parse(incomingKey) as T, [incomingKey]);
  const [local, setLocal] = useState<DraftState<T> | null>(null);
  const hasLocalChanges = Boolean(local && JSON.stringify(local.draft) !== JSON.stringify(local.baseline) && JSON.stringify(local.draft) !== incomingKey);
  const draft = hasLocalChanges ? local!.draft : stableIncoming;
  const expectedUpdatedAt = hasLocalChanges ? local!.baseVersion : version;
  const setDraft = useCallback((change: SetStateAction<T>) => {
    setLocal((current) => {
      const currentDirty = current && JSON.stringify(current.draft) !== JSON.stringify(current.baseline) && JSON.stringify(current.draft) !== incomingKey;
      const base = currentDirty ? current : { baseline: stableIncoming, baseVersion: version, draft: stableIncoming };
      const draft = typeof change === "function" ? (change as (previous: T) => T)(base.draft) : change;
      return { ...base, draft };
    });
  }, [incomingKey, stableIncoming, version]);
  return { draft, setDraft, expectedUpdatedAt, hasConflict: hasLocalChanges && version !== local!.baseVersion };
};
