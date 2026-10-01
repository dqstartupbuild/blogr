import { createContext } from "react";
import type { LocalState } from "../domain/LocalState";

export type LocalWorkspaceContextValue = {
  state: LocalState | undefined;
  refresh: () => Promise<LocalState>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query: (name: string, args?: Record<string, unknown>) => Promise<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mutate: (name: string, args?: Record<string, unknown>) => Promise<any>;
};

export const LocalWorkspaceContext = createContext<LocalWorkspaceContextValue | null>(null);
