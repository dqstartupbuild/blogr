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
      className={`flex h-12 flex-col items-center justify-center gap-1 rounded-md px-2 text-[11px] font-semibold transition lg:h-11 lg:flex-row lg:justify-start lg:gap-3 lg:px-3 lg:text-sm lg:font-medium ${
        isActive ? "bg-black text-white" : "text-black hover:bg-black/5"
      }`}
      href={href}
      onClick={() => setMode(mode)}
    >
      <Icon className="h-5 w-5 lg:h-[18px] lg:w-[18px]" aria-hidden="true" />
      {label}
    </Link>
  );
};
