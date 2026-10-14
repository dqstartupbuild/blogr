import type { LocalWorkspaceRepository } from "../application/LocalWorkspaceRepository";
import { readLocalState } from "./readLocalState";
import { updateLocalState } from "./updateLocalState";

export const fileLocalWorkspaceRepository: LocalWorkspaceRepository = { read: readLocalState, update: updateLocalState };
