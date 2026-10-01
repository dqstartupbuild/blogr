import type { LocalWorkspaceRepository } from "./LocalWorkspaceRepository";
import { mutateLocalState } from "../server/mutateLocalState";

export const executeLocalMutation = (repository: LocalWorkspaceRepository, name: string, args: Record<string, unknown>, expectedRevision: number) => repository.update(expectedRevision, (state) => mutateLocalState(state, name, args));
