import { RegenerateableImage } from "./RegenerateableImage";
import type { BlogImageItem } from "../types/BlogImageItem";
import type { RegenerateBlogImage } from "../types/RegenerateBlogImage";
import type { UpdateBlogImages } from "../types/UpdateBlogImages";

type RegenerateableFeatureImageProps = {
  alt: string;
  blogId?: string;
  imageIndex?: number;
  images?: BlogImageItem[];
  mdx?: string;
  prompt?: string;
  regenerateImage?: RegenerateBlogImage;
  src?: string;
  title?: string;
  updateBlogImages?: UpdateBlogImages;
};

export const RegenerateableFeatureImage = ({
  alt,
  blogId,
  imageIndex,
  images,
  mdx,
  prompt,
  regenerateImage,
  src,
  title,
  updateBlogImages,
}: RegenerateableFeatureImageProps) => {
  return (
    <RegenerateableImage
      alt={alt}
      blogId={blogId}
      imageIndex={imageIndex}
      images={images}
      isFeatureImage
      mdx={mdx}
      prompt={prompt}
      regenerateImage={regenerateImage}
      src={src}
      title={title}
      updateBlogImages={updateBlogImages}
      variant="feature"
    />
  );
};
