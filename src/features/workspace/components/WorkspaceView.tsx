"use client";

import { BlogPreviewPanel } from "./BlogPreviewPanel";
import { BlogsPanel } from "./BlogsPanel";
import { ProductSetupPanel } from "./ProductSetupPanel";
import { TopicsPanel } from "./TopicsPanel";
import { WorkspaceShell } from "./WorkspaceShell";
import { useDemoWorkspace } from "../hooks/useDemoWorkspace";
import type { WorkspaceViewMode } from "../types/WorkspaceViewMode";

type WorkspaceViewProps = {
  initialMode: WorkspaceViewMode;
};

export const WorkspaceView = ({ initialMode }: WorkspaceViewProps) => {
  const workspace = useDemoWorkspace(initialMode);

  return (
    <WorkspaceShell mode={workspace.mode} setMode={workspace.setMode}>
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
        <main className="space-y-5">
          <ProductSetupPanel
            product={workspace.product}
            scanProduct={workspace.scanProduct}
          />
          {workspace.mode === "topics" ? (
            <TopicsPanel
              addTopic={workspace.addTopic}
              topics={workspace.topics}
              writeBlog={workspace.writeBlog}
            />
          ) : (
            <BlogsPanel
              blogs={workspace.blogs}
              selectedBlogId={workspace.selectedBlogId}
              setSelectedBlogId={workspace.setSelectedBlogId}
            />
          )}
        </main>
        <BlogPreviewPanel blog={workspace.selectedBlog} />
      </div>
    </WorkspaceShell>
  );
};
