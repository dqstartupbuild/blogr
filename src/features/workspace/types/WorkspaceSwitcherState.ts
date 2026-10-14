import type { CreateProductWorkspaceInput } from "./CreateProductWorkspaceInput";
import type { ProductWorkspace } from "./ProductWorkspace";

export type WorkspaceSwitcherState = {
  activeWorkspace?: ProductWorkspace;
  activeWorkspaceId: string;
  createWorkspace: (
    input: CreateProductWorkspaceInput,
  ) => Promise<string | undefined>;
  isLoadingWorkspaces: boolean;
  selectWorkspace: (workspaceId: string) => Promise<void>;
  workspaces: ProductWorkspace[];
};
