import type { ImgHTMLAttributes } from "react";
import { MarkdownPreviewLink } from "./MarkdownPreviewLink";
import { RegenerateableImage } from "./RegenerateableImage";
import { getImageUrlPathKey } from "../utils/getImageUrlPathKey";
import { resolveBlogImageMatches } from "../utils/resolveBlogImageMatches";
import type { BlogImageItem } from "../types/BlogImageItem";
import type { RegenerateBlogImage } from "../types/RegenerateBlogImage";
import type { UpdateBlogImages } from "../types/UpdateBlogImages";

type BuildMarkdownPreviewComponentsOptions = {
  blogId?: string;
  images?: BlogImageItem[];
  mdx?: string;
  regenerateImage?: RegenerateBlogImage;
  title?: string;
  updateBlogImages?: UpdateBlogImages;
};

export const buildMarkdownPreviewComponents = ({
  blogId,
  images,
  mdx,
  regenerateImage,
  title,
  updateBlogImages,
}: BuildMarkdownPreviewComponentsOptions = {}) => {
  const imageList = images || [];
  const matches = resolveBlogImageMatches({ images: imageList, mdx: mdx || "" });
  const matchesByPathKey = new Map(
    Array.from(matches.entries()).map(([src, match]) => [
      getImageUrlPathKey(src),
      match,
    ]),
  );

  const findMatch = (src?: string) => {
    if (!src) {
      return undefined;
    }

    return matches.get(src) ?? matchesByPathKey.get(getImageUrlPathKey(src));
  };

  return {
    a: MarkdownPreviewLink,
    img: ({ alt, src }: ImgHTMLAttributes<HTMLImageElement>) => {
      const srcString = typeof src === "string" ? src : undefined;
      const match = findMatch(srcString);

      return (
        <RegenerateableImage
          alt={alt || match?.alt || ""}
          blogId={blogId}
          imageIndex={match?.imageIndex}
          images={imageList}
          isFeatureImage={match?.imageIndex === 0}
          mdx={mdx}
          prompt={match?.prompt}
          regenerateImage={regenerateImage}
          src={srcString}
          title={title}
          updateBlogImages={updateBlogImages}
        />
      );
    },
  };
};

export const markdownPreviewComponents = buildMarkdownPreviewComponents();
