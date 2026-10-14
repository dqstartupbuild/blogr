import type { LocalState } from "../domain/LocalState";

export type LocalWorkspaceRepository = {
  read: () => Promise<LocalState>;
  update: <T>(expectedRevision: number, change: (state: LocalState) => T | Promise<T>) => Promise<{ result: T; state: LocalState }>;
};
