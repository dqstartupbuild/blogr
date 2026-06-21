"use client";

import { BlogPreviewPanel } from "./BlogPreviewPanel";
import { BlogsPanel } from "./BlogsPanel";
import { ProductSetupPanel } from "./ProductSetupPanel";
import { TopicsPanel } from "./TopicsPanel";
import { WorkspaceShell } from "./WorkspaceShell";
import type { BlogItem } from "../types/BlogItem";
import type { ProductProfile } from "../types/ProductProfile";
import type { ProductScanState } from "../types/ProductScanState";
import type { TopicItem } from "../types/TopicItem";
import type { WorkspaceSwitcherState } from "../types/WorkspaceSwitcherState";
import type { WorkspaceViewMode } from "../types/WorkspaceViewMode";

type WorkspaceContentProps = {
  addTopic: (keyword: string) => void | Promise<void>;
  blogs: BlogItem[];
  mode: WorkspaceViewMode;
  product: ProductProfile;
  productScanState: ProductScanState;
  scanProduct: (websiteUrl: string, niche: string) => void | Promise<void>;
  selectedBlog?: BlogItem;
  selectedBlogId: string;
  setMode: (mode: WorkspaceViewMode) => void;
  setSelectedBlogId: (blogId: string) => void;
  topics: TopicItem[];
  workspaceSwitcher: WorkspaceSwitcherState;
  writeBlog: (topicId: string) => void | Promise<void>;
};

export const WorkspaceContent = ({
  addTopic,
  blogs,
  mode,
  product,
  productScanState,
  scanProduct,
  selectedBlog,
  selectedBlogId,
  setMode,
  setSelectedBlogId,
  topics,
  workspaceSwitcher,
  writeBlog,
}: WorkspaceContentProps) => {
  return (
    <WorkspaceShell
      mode={mode}
      setMode={setMode}
      workspaceSwitcher={workspaceSwitcher}
    >
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
        <main className="space-y-5">
          <ProductSetupPanel
            key={`${product.websiteUrl}:${product.niche}`}
            product={product}
            productScanState={productScanState}
            scanProduct={scanProduct}
          />
          {mode === "topics" ? (
            <TopicsPanel
              addTopic={addTopic}
              topics={topics}
              writeBlog={writeBlog}
            />
          ) : (
            <BlogsPanel
              blogs={blogs}
              selectedBlogId={selectedBlogId}
              setSelectedBlogId={setSelectedBlogId}
            />
          )}
        </main>
        <BlogPreviewPanel blog={selectedBlog} />
      </div>
    </WorkspaceShell>
  );
};
