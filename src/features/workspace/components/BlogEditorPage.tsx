import { isAuthDisabledForPreview } from "@/server/auth/isAuthDisabledForPreview";
import { BlogEditorView } from "./BlogEditorView";

type BlogEditorPageProps = {
  blogId: string;
};

export const BlogEditorPage = ({ blogId }: BlogEditorPageProps) => {
  return (
    <BlogEditorView
      blogId={blogId}
      forceDemo={isAuthDisabledForPreview()}
    />
  );
};
