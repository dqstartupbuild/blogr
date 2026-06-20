"use client";

import { useState } from "react";
import { Globe2 } from "lucide-react";
import { PrimaryButton } from "./PrimaryButton";
import { SectionTitle } from "./SectionTitle";
import { TextField } from "./TextField";
import type { ProductProfile } from "../types/ProductProfile";

type ProductSetupPanelProps = {
  product: ProductProfile;
  scanProduct: (websiteUrl: string, niche: string) => void;
};

export const ProductSetupPanel = ({
  product,
  scanProduct,
}: ProductSetupPanelProps) => {
  const [websiteUrl, setWebsiteUrl] = useState(product.websiteUrl);
  const [niche, setNiche] = useState(product.niche);

  return (
    <section className="rounded-lg border border-[#ded8ca] bg-[#fffdf8] p-4 shadow-sm">
      <SectionTitle title="Product" />
      <form
        className="mt-4 grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]"
        onSubmit={(event) => {
          event.preventDefault();
          scanProduct(websiteUrl, niche);
        }}
      >
        <TextField
          id="website-url"
          label="Website"
          onChange={(event) => setWebsiteUrl(event.target.value)}
          placeholder="https://your-site.com"
          value={websiteUrl}
        />
        <TextField
          id="product-niche"
          label="Niche"
          onChange={(event) => setNiche(event.target.value)}
          placeholder="Who you help"
          value={niche}
        />
        <div className="flex items-end">
          <PrimaryButton type="submit">
            <Globe2 size={16} aria-hidden="true" />
            Scan site
          </PrimaryButton>
        </div>
      </form>
      <div className="mt-4 grid gap-3 text-sm text-[#4d5a53] lg:grid-cols-[minmax(0,1fr)_220px]">
        <p>{product.description}</p>
        <div className="flex flex-wrap gap-2">
          {product.colors.map((color) => (
            <span
              aria-label={`Brand color ${color}`}
              className="h-8 w-8 rounded-md border border-black/10"
              key={color}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
