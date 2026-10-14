"use client";

import type { ChangeEvent } from "react";
import type { ProductWorkspace } from "../types/ProductWorkspace";

type WorkspaceSelectProps = {
  activeWorkspaceId: string;
  disabled: boolean;
  isCompact?: boolean;
  onChange: (workspaceId: string) => void;
  workspaces: ProductWorkspace[];
};

export const WorkspaceSelect = ({
  activeWorkspaceId,
  disabled,
  isCompact = false,
  onChange,
  workspaces,
}: WorkspaceSelectProps) => {
  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onChange(event.target.value);
  };

  return (
    <label
      className={
        isCompact
          ? "min-w-0 flex-1 text-xs font-semibold text-black"
          : "grid gap-1 text-xs font-semibold text-black"
      }
    >
      <span className={isCompact ? "sr-only" : undefined}>Workspace</span>
      <select
        className={
          isCompact
            ? "h-9 w-full min-w-0 rounded-full border border-black/15 bg-white px-3 text-xs font-semibold text-black outline-none disabled:cursor-not-allowed"
            : "h-10 w-full min-w-0 rounded-md border border-black/15 bg-white px-3 text-sm font-medium text-black outline-none disabled:cursor-not-allowed"
        }
        disabled={disabled}
        onChange={handleChange}
        value={activeWorkspaceId}
      >
        {workspaces.length === 0 ? (
          <option value="">No workspace yet</option>
        ) : null}
        {workspaces.map((workspace) => (
          <option key={workspace.id} value={workspace.id}>
            {workspace.name}
          </option>
        ))}
      </select>
    </label>
  );
};
