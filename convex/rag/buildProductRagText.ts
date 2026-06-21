type LinkItem = {
  title: string;
  url: string;
  reason?: string;
};

type BuildProductRagTextOptions = {
  audience: string;
  competitors: string;
  description: string;
  name: string;
  niche: string;
  rawContext: string;
  siteLinks: LinkItem[];
  websiteUrl: string;
};

export const buildProductRagText = ({
  audience,
  competitors,
  description,
  name,
  niche,
  rawContext,
  siteLinks,
  websiteUrl,
}: BuildProductRagTextOptions) => {
  const linkText = siteLinks
    .map((link) =>
      [`Title: ${link.title}`, `URL: ${link.url}`, link.reason || ""]
        .filter(Boolean)
        .join("\n"),
    )
    .join("\n\n");

  return `
Product: ${name}
Website: ${websiteUrl}
Niche: ${niche}
Audience: ${audience}
Description: ${description}
Competitors: ${competitors}

Internal site links:
${linkText}

Scanned website context:
${rawContext}
`.trim();
};
