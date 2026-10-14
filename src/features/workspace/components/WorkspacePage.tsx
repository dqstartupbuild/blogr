import { LiveWorkspaceView } from "./LiveWorkspaceView";
import type { WorkspaceViewMode } from "../types/WorkspaceViewMode";
export const WorkspacePage = ({ initialMode }: { initialMode: WorkspaceViewMode }) => <LiveWorkspaceView initialMode={initialMode} />;
