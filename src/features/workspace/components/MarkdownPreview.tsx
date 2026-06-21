import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { markdownPreviewComponents } from "./markdownPreviewComponents";
import styles from "./MarkdownPreview.module.css";
import { replaceYoutubeIframesWithMarkdownLinks } from "../utils/replaceYoutubeIframesWithMarkdownLinks";
import { stripMdxFrontmatter } from "../utils/stripMdxFrontmatter";

type MarkdownPreviewProps = {
  mdx: string;
};

export const MarkdownPreview = ({ mdx }: MarkdownPreviewProps) => {
  const markdown = replaceYoutubeIframesWithMarkdownLinks(
    stripMdxFrontmatter(mdx),
  ).trim();

  if (!markdown) {
    return <p className="text-sm leading-6 text-black">Nothing to preview yet.</p>;
  }

  return (
    <div className={styles.markdownPreview}>
      <ReactMarkdown
        components={markdownPreviewComponents}
        remarkPlugins={[remarkGfm]}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
};
