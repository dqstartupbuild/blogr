"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import type { WorkspaceViewMode } from "../types/WorkspaceViewMode";

type WorkspaceSidebarLinkProps = {
  href: string;
  icon: LucideIcon;
  isActive: boolean;
  label: string;
  mode: WorkspaceViewMode;
  setMode: (mode: WorkspaceViewMode) => void;
};

export const WorkspaceSidebarLink = ({
  href,
  icon: Icon,
  isActive,
  label,
  mode,
  setMode,
}: WorkspaceSidebarLinkProps) => {
  return (
    <Link
      aria-current={isActive ? "page" : undefined}
      className={`flex h-11 items-center gap-3 rounded-md px-3 text-sm font-medium transition ${
        isActive ? "bg-black text-white" : "text-black hover:bg-black/5"
      }`}
      href={href}
      onClick={() => setMode(mode)}
    >
      <Icon size={18} aria-hidden="true" />
      {label}
    </Link>
  );
};
