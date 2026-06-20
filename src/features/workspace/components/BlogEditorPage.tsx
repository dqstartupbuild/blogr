import { isAuthDisabledForPreview } from "@/server/auth/isAuthDisabledForPreview";
import { isLiveWorkspaceEnabled } from "@/config/isLiveWorkspaceEnabled";
import { BlogEditorView } from "./BlogEditorView";
import { LiveBlogEditorView } from "./LiveBlogEditorView";

type BlogEditorPageProps = {
  blogId: string;
};

export const BlogEditorPage = ({ blogId }: BlogEditorPageProps) => {
  const shouldUseLiveEditor =
    !isAuthDisabledForPreview() && isLiveWorkspaceEnabled();

  if (shouldUseLiveEditor) {
    return <LiveBlogEditorView blogId={blogId} />;
  }

  return <BlogEditorView blogId={blogId} forceDemo={true} />;
};
