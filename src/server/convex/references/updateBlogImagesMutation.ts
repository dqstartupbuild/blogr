import { makeFunctionReference } from "convex/server";
import type { Id } from "../../../../convex/_generated/dataModel";
import type { BlogImageItem } from "@/features/workspace/types/BlogImageItem";

type UpdateBlogImagesMutationArgs = {
  blogId: Id<"blogs">;
  featureImageUrl?: string;
  images: BlogImageItem[];
  mdx: string;
  productId?: Id<"products">;
};

export const updateBlogImagesMutation = makeFunctionReference<
  "mutation",
  UpdateBlogImagesMutationArgs,
  null
>("blogs/updateBlogImages:updateBlogImages");
