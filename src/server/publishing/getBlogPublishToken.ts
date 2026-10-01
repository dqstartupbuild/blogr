import { z } from "zod";

const tokenMapSchema = z.record(z.string().uuid(), z.string().min(1));

export const getBlogPublishToken = (productId?: string) => {
  const encoded = process.env.BLOG_PUBLISH_WEBHOOK_TOKENS?.trim();
  if (productId && encoded) {
    let map: Record<string, string>;
    try { map = tokenMapSchema.parse(JSON.parse(encoded)); }
    catch { throw new Error("BLOG_PUBLISH_WEBHOOK_TOKENS must be a JSON map of product IDs to tokens."); }
    if (map[productId]?.trim()) return map[productId].trim();
  }
  return process.env.BLOG_PUBLISH_WEBHOOK_TOKEN?.trim() || "";
};
