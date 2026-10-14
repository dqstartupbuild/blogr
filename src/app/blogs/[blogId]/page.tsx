import { BlogEditorPage } from "@/features/workspace/components/BlogEditorPage";

type BlogEditorRouteProps = {
  params: Promise<{ blogId: string }>;
};

export default async function BlogEditorRoute({ params }: BlogEditorRouteProps) {
  const { blogId } = await params;

  return <BlogEditorPage blogId={blogId} />;
}
