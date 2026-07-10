import type { Doc } from "../_generated/dataModel";

export const sanitizeProductExternalLinks = (
  links: NonNullable<Doc<"products">["externalLinks"]>,
) => {
  const sanitized = links.flatMap((link) => {
    const label = link.label.trim();
    const url = link.url.trim();

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

  return Array.from(new Map(sanitized.map((link) => [link.url, link])).values());
};
