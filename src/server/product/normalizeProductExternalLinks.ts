import type { ProductExternalLink } from "@/features/workspace/types/ProductExternalLink";

export const normalizeProductExternalLinks = (
  value: unknown,
): ProductExternalLink[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  const links = value.flatMap((item) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      return [];
    }

    const link = item as Record<string, unknown>;
    const label = typeof link.label === "string" ? link.label.trim() : "";
    const url = typeof link.url === "string" ? link.url.trim() : "";

    try {
      const parsedUrl = new URL(url);

      if (parsedUrl.protocol !== "https:" && parsedUrl.protocol !== "http:") {
        return [];
      }
    } catch {
      return [];
    }

    return [{ label: label || "Product link", url }];
  });

  return Array.from(new Map(links.map((link) => [link.url, link])).values());
};
