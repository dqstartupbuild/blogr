"use client";

import { useState } from "react";
import { Globe2 } from "lucide-react";
import { PrimaryButton } from "./PrimaryButton";
import { SectionTitle } from "./SectionTitle";
import { TextField } from "./TextField";
import type { ProductProfile } from "../types/ProductProfile";
import type { ProductScanState } from "../types/ProductScanState";

type ProductSetupPanelProps = {
  product: ProductProfile;
  productScanState: ProductScanState;
  scanProduct: (websiteUrl: string, niche: string) => void;
};

export const ProductSetupPanel = ({
  product,
  productScanState,
  scanProduct,
}: ProductSetupPanelProps) => {
  const [websiteUrl, setWebsiteUrl] = useState(product.websiteUrl);
  const [niche, setNiche] = useState(product.niche);

  return (
    <section className="rounded-lg border border-black/10 bg-white p-4 shadow-sm">
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
          <PrimaryButton disabled={productScanState.isScanning} type="submit">
            <Globe2 size={16} aria-hidden="true" />
            {productScanState.isScanning ? "Scanning" : "Scan site"}
          </PrimaryButton>
        </div>
      </form>
      {productScanState.message ? (
        <p className="mt-3 text-sm font-medium text-black" aria-live="polite">
          {productScanState.message}
        </p>
      ) : null}
    </section>
  );
};
