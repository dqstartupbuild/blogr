import { storeLocalImage } from "@/local/server/storeLocalImage";
import type { BlogImage } from "./types/BlogImage";
export const storeGeneratedBlogImage = async ({ image }: { image: BlogImage }): Promise<BlogImage> => ({ ...image, url: await storeLocalImage(image.url) });
