"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { WorkspaceCreateButton } from "./WorkspaceCreateButton";
import { WorkspaceCreateForm } from "./WorkspaceCreateForm";
import { WorkspaceSelect } from "./WorkspaceSelect";
import { WorkspaceSwitcherStatus } from "./WorkspaceSwitcherStatus";
import type { CreateProductWorkspaceInput } from "../types/CreateProductWorkspaceInput";
import type { WorkspaceSwitcherState } from "../types/WorkspaceSwitcherState";
import { getWorkspaceSwitchRoute } from "../utils/getWorkspaceSwitchRoute";

export const WorkspaceSwitcher = ({
  activeWorkspaceId,
  createWorkspace,
  isLoadingWorkspaces,
  selectWorkspace,
  workspaces,
}: WorkspaceSwitcherState) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const isBusy = isLoadingWorkspaces || isSaving;

  const refreshWorkspaceRoute = () => {
    const route = getWorkspaceSwitchRoute(pathname);

    if (route) {
      router.replace(route, { scroll: false });
      return;
    }

    router.refresh();
  };

  const handleWorkspaceChange = async (workspaceId: string) => {
    setMessage("");
    setIsSaving(true);

    try {
      await selectWorkspace(workspaceId);
      refreshWorkspaceRoute();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not switch workspace.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateWorkspace = async (
    input: CreateProductWorkspaceInput,
  ) => {
    setMessage("");
    setIsSaving(true);

    try {
      await createWorkspace(input);
      setIsCreating(false);
      refreshWorkspaceRoute();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not create workspace.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="grid max-w-full gap-2">
      <WorkspaceSelect
        activeWorkspaceId={activeWorkspaceId}
        disabled={isBusy}
        onChange={handleWorkspaceChange}
        workspaces={workspaces}
      />
      <WorkspaceCreateButton
        disabled={isBusy}
        onClick={() => setIsCreating(true)}
      />
      {isCreating ? (
        <WorkspaceCreateForm
          disabled={isBusy}
          onCancel={() => setIsCreating(false)}
          onCreate={handleCreateWorkspace}
        />
      ) : null}
      <WorkspaceSwitcherStatus message={message} />
    </div>
  );
};
