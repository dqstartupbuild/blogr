import type { ImgHTMLAttributes } from "react";
import { MarkdownPreviewLink } from "./MarkdownPreviewLink";
import { RegenerateableImage } from "./RegenerateableImage";
import type { BlogImageItem } from "../types/BlogImageItem";
import type { RegenerateBlogImage } from "../types/RegenerateBlogImage";

type BuildMarkdownPreviewComponentsOptions = {
  blogId?: string;
  images?: BlogImageItem[];
  regenerateImage?: RegenerateBlogImage;
};

export const buildMarkdownPreviewComponents = ({
  blogId,
  images,
  regenerateImage,
}: BuildMarkdownPreviewComponentsOptions = {}) => {
  const findImageIndex = (src?: string) => {
    if (!src || !images) return undefined;
    return images.findIndex((image) => image.url === src);
  };

  return {
    a: MarkdownPreviewLink,
    img: ({ alt, src }: ImgHTMLAttributes<HTMLImageElement>) => {
      const srcString = typeof src === "string" ? src : undefined;
      const imageIndex = findImageIndex(srcString);
      const matchedImage =
        typeof imageIndex === "number" && imageIndex >= 0
          ? images?.[imageIndex]
          : undefined;

      return (
        <RegenerateableImage
          alt={alt || matchedImage?.alt || ""}
          blogId={blogId}
          imageIndex={imageIndex}
          isFeatureImage={imageIndex === 0}
          prompt={matchedImage?.prompt}
          regenerateImage={regenerateImage}
          src={srcString}
        />
      );
    },
  };
};

export const markdownPreviewComponents = buildMarkdownPreviewComponents();
