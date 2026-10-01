import type { LocalWorkspaceRepository } from "./LocalWorkspaceRepository";
import { queryLocalState } from "../client/queryLocalState";

export const executeLocalQuery = async (repository: LocalWorkspaceRepository, name: string, args: Record<string, unknown>) => queryLocalState(await repository.read(), name, args);
