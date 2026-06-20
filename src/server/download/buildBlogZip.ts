import JSZip from "jszip";
import type { BlogItem } from "@/features/workspace/types/BlogItem";
import { buildBlogMetadata } from "./buildBlogMetadata";
import { buildBlogReadme } from "./buildBlogReadme";
import { collectBlogImageUrls } from "./collectBlogImageUrls";
import { downloadBlogImages } from "./downloadBlogImages";
import { replaceImageUrlsInMdx } from "./replaceImageUrlsInMdx";
import { safeFilename } from "./safeFilename";

export const buildBlogZip = async (blog: BlogItem) => {
  const zip = new JSZip();
  const imageUrls = collectBlogImageUrls(blog);
  const downloadedImages = await downloadBlogImages(imageUrls);
  const mdx = replaceImageUrlsInMdx(blog.mdx, downloadedImages);
  const filename = safeFilename(blog.slug || blog.title);

  zip.file(`${filename}.mdx`, mdx);
  zip.file("README.md", buildBlogReadme(blog));
  zip.file("metadata.json", buildBlogMetadata(blog, downloadedImages));

  downloadedImages.forEach((image) => {
    zip.file(image.localPath, image.bytes);
  });

  return await zip.generateAsync({ type: "arraybuffer" });
};
