import type { LocalState } from "../../domain/LocalState";
import { getEditableProduct } from "./getEditableProduct";
import { getBlogPublishToken } from "@/server/publishing/getBlogPublishToken";
export const updateBlogPublishingIntegration = (state: LocalState, args: Record<string, unknown>) => {
  const product = getEditableProduct(state, args);
  if (args.expectedProductUpdatedAt !== product.updatedAt) throw new Error("Publishing settings changed on another tab. Reload before saving your edits.");
  if (String(args.accessToken || "").trim()) throw new Error("Set BLOG_PUBLISH_WEBHOOK_TOKEN or BLOG_PUBLISH_WEBHOOK_TOKENS in the local server environment, then save the receiver settings.");
  if (args.enabled) {
    if (!getBlogPublishToken(product.id)) throw new Error("Set a publishing token for this project in the local server environment before connecting publishing.");
    const webhookUrl = String(args.webhookUrl || process.env.BLOG_PUBLISH_WEBHOOK_URL || "");
    try { const parsed = new URL(webhookUrl); if (parsed.protocol !== "https:" && !(parsed.protocol === "http:" && ["localhost", "127.0.0.1", "[::1]"].includes(parsed.hostname))) throw new Error(); }
    catch { throw new Error("Enter an HTTPS webhook URL before connecting publishing."); }
  }
  product.blogPublishingIntegration = { enabled: Boolean(args.enabled), hasAccessToken: false, sourceName: String(args.sourceName || ""), webhookUrl: String(args.webhookUrl || ""), updatedAt: Date.now() };
  product.updatedAt = Math.max(Date.now(), product.updatedAt + 1);
  return product.id;
};
