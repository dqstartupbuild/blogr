"use client";

import { useContext } from "react";
import { LocalWorkspaceContext } from "./LocalWorkspaceContext";

export const useLocalWorkspace = () => {
  const context = useContext(LocalWorkspaceContext);
  if (!context) throw new Error("Local workspace is unavailable");
  return context;
};
