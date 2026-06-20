import { BlogList } from "./BlogList";
import { SectionTitle } from "./SectionTitle";
import type { BlogItem } from "../types/BlogItem";

type BlogsPanelProps = {
  blogs: BlogItem[];
  selectedBlogId: string;
  setSelectedBlogId: (blogId: string) => void;
};

export const BlogsPanel = ({
  blogs,
  selectedBlogId,
  setSelectedBlogId,
}: BlogsPanelProps) => {
  return (
    <section className="rounded-lg border border-black bg-white p-4">
      <SectionTitle title="Blogs" />
      <BlogList
        blogs={blogs}
        selectedBlogId={selectedBlogId}
        setSelectedBlogId={setSelectedBlogId}
      />
    </section>
  );
};
