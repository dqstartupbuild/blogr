"use client";

import { useCallback } from "react";
import { useLocalWorkspace } from "./useLocalWorkspace";
import type { LocalMutationName, LocalMutationResults } from "./LocalMutationResults";

export const useMutation = <N extends LocalMutationName>(name: N) => {
  const { mutate } = useLocalWorkspace();
  return useCallback((args: Record<string, unknown> = {}): Promise<LocalMutationResults[N]> => mutate(name, args) as Promise<LocalMutationResults[N]>, [mutate, name]);
};
