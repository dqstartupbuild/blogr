import type { LocalState } from "../../domain/LocalState";
export const summarizeBlog = (blog: LocalState["blogs"][number]) => ({ ...blog, blogId: blog.id, mdx: undefined, images: undefined, wordCount: blog.mdx.trim().split(/\s+/).filter(Boolean).length });
