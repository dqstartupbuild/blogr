"use client";
import type { ReactNode } from "react";
import { LocalWorkspaceProvider } from "@/local/client/LocalWorkspaceProvider";
export const Providers = ({ children }: { children: ReactNode }) => <LocalWorkspaceProvider>{children}</LocalWorkspaceProvider>;
