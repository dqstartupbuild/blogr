"use client";

import { useMemo } from "react";
import { useMutation, useQuery } from "convex/react";
import { castProductId } from "@/server/convex/castProductId";
import { createProductWorkspaceMutation } from "@/server/convex/references/createProductWorkspaceMutation";
import { getProductWorkspacesQuery } from "@/server/convex/references/getProductWorkspacesQuery";
import { setActiveProductWorkspaceMutation } from "@/server/convex/references/setActiveProductWorkspaceMutation";
import { mapConvexProductWorkspace } from "../mappers/mapConvexProductWorkspace";
import type { CreateProductWorkspaceInput } from "../types/CreateProductWorkspaceInput";
import type { WorkspaceSwitcherState } from "../types/WorkspaceSwitcherState";

export const useLiveWorkspaceSwitcher = (): WorkspaceSwitcherState => {
  const workspaceResult = useQuery(getProductWorkspacesQuery);
  const createProductWorkspace = useMutation(createProductWorkspaceMutation);
  const setActiveProductWorkspace = useMutation(
    setActiveProductWorkspaceMutation,
  );
  const workspaces = useMemo(
    () => (workspaceResult?.products || []).map(mapConvexProductWorkspace),
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
