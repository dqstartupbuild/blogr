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
    <section className="rounded-lg border border-[#ded8ca] bg-[#fffdf8] p-4 shadow-sm">
      <SectionTitle title="Blogs" />
      <BlogList
        blogs={blogs}
        selectedBlogId={selectedBlogId}
        setSelectedBlogId={setSelectedBlogId}
      />
    </section>
  );
};
