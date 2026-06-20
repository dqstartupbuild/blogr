import { WorkspaceView } from "./WorkspaceView";
import type { WorkspaceViewMode } from "../types/WorkspaceViewMode";

type WorkspacePageProps = {
  initialMode: WorkspaceViewMode;
};

export const WorkspacePage = ({ initialMode }: WorkspacePageProps) => {
  return <WorkspaceView initialMode={initialMode} />;
};
