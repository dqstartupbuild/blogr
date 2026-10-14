import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { buildMarkdownPreviewComponents } from "./markdownPreviewComponents";
import styles from "./MarkdownPreview.module.css";
import { replaceYoutubeIframesWithMarkdownLinks } from "../utils/replaceYoutubeIframesWithMarkdownLinks";
import { stripMdxFrontmatter } from "../utils/stripMdxFrontmatter";
import type { BlogImageItem } from "../types/BlogImageItem";
import type { RegenerateBlogImage } from "../types/RegenerateBlogImage";
import type { UpdateBlogImages } from "../types/UpdateBlogImages";

type MarkdownPreviewProps = {
  blogId?: string;
  images?: BlogImageItem[];
  mdx: string;
  regenerateImage?: RegenerateBlogImage;
  title?: string;
  updateBlogImages?: UpdateBlogImages;
};

export const MarkdownPreview = ({
  blogId,
  images,
  mdx,
  regenerateImage,
  title,
  updateBlogImages,
}: MarkdownPreviewProps) => {
  const markdown = replaceYoutubeIframesWithMarkdownLinks(
    stripMdxFrontmatter(mdx),
  ).trim();

  if (!markdown) {
    return <p className="text-sm leading-6 text-black">Nothing to preview yet.</p>;
  }

  return (
    <div className={styles.markdownPreview}>
      <ReactMarkdown
        components={buildMarkdownPreviewComponents({
          blogId,
          images,
          mdx,
          regenerateImage,
          title,
          updateBlogImages,
        })}
        remarkPlugins={[remarkGfm]}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
};
