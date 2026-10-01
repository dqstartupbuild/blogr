"use client";

import { useMemo } from "react";
import { useMutation, useQuery } from "@/local/client/hooks";
import { castProductId } from "@/local/client/castProductId";
import { createProductWorkspaceMutation } from "@/local/client/references/createProductWorkspaceMutation";
import { getProductWorkspacesQuery } from "@/local/client/references/getProductWorkspacesQuery";
import { setActiveProductWorkspaceMutation } from "@/local/client/references/setActiveProductWorkspaceMutation";
import { mapLocalProductWorkspace } from "../mappers/mapLocalProductWorkspace";
import type { CreateProductWorkspaceInput } from "../types/CreateProductWorkspaceInput";
import type { WorkspaceSwitcherState } from "../types/WorkspaceSwitcherState";
import type { ProductWorkspace } from "../types/ProductWorkspace";

export const useLiveWorkspaceSwitcher = (): WorkspaceSwitcherState => {
  const workspaceResult = useQuery<{ products: Array<ProductWorkspace & { _id: string }>; activeProductId?: string }>(getProductWorkspacesQuery);
  const createProductWorkspace = useMutation(createProductWorkspaceMutation);
  const setActiveProductWorkspace = useMutation(
    setActiveProductWorkspaceMutation,
  );
  const workspaces = useMemo(
    () => (workspaceResult?.products || []).map(mapLocalProductWorkspace),
    [workspaceResult],
  );
  const activeWorkspaceId = workspaceResult?.activeProductId || "";
  const activeWorkspace = useMemo(
    () => workspaces.find((workspace) => workspace.id === activeWorkspaceId),
    [activeWorkspaceId, workspaces],
  );

  const selectWorkspace = async (workspaceId: string) => {
    if (!workspaceId || workspaceId === activeWorkspaceId) {
      return;
    }

    await setActiveProductWorkspace({
      productId: castProductId(workspaceId),
    });
  };

  const createWorkspace = async (input: CreateProductWorkspaceInput) => {
    const productId = await createProductWorkspace(input);

    return productId;
  };

  return {
    activeWorkspace,
    activeWorkspaceId,
    createWorkspace,
    isLoadingWorkspaces: workspaceResult === undefined,
    selectWorkspace,
    workspaces,
  };
};
