type LinkItem = {
  isActive?: boolean;
  title: string;
  url: string;
  reason?: string;
};

type ProductPrice = {
  billingPeriod?: string;
  details?: string;
  name: string;
  price: string;
};

type ProductExternalLink = {
  label: string;
  url: string;
};

type BuildProductRagTextOptions = {
  audience: string;
  competitors: string;
  description: string;
  externalLinks: ProductExternalLink[];
  features: string[];
  name: string;
  niche: string;
  offers: string[];
  pricing: ProductPrice[];
  rawContext: string;
  siteLinks: LinkItem[];
  websiteUrl: string;
};

export const buildProductRagText = ({
  audience,
  competitors,
  description,
  externalLinks,
  features,
  name,
  niche,
  offers,
  pricing,
  rawContext,
  siteLinks,
  websiteUrl,
}: BuildProductRagTextOptions) => {
  const linkText = siteLinks
    .filter((link) => link.isActive !== false)
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
Features: ${features.join("; ")}
Pricing: ${pricing
    .map((price) =>
      [price.name, price.price, price.billingPeriod, price.details]
        .filter(Boolean)
        .join(" - "),
    )
    .join("; ")}
Offers: ${offers.join("; ")}
External product links: ${externalLinks
    .map((link) => `${link.label}: ${link.url}`)
    .join("; ")}

Internal site links:
${linkText}

Scanned website context:
${rawContext}
`.trim();
};
