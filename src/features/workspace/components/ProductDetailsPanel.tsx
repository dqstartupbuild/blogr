"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { PrimaryButton } from "./PrimaryButton";
import { ProductExternalLinksEditor } from "./ProductExternalLinksEditor";
import { ProductPricingEditor } from "./ProductPricingEditor";
import { SectionTitle } from "./SectionTitle";
import { StringListEditor } from "./StringListEditor";
import { TextField } from "./TextField";
import type { ProductDetailsDraft } from "../types/ProductDetailsDraft";
import type { ProductDetailsState } from "../types/ProductDetailsState";
import type { ProductProfile } from "../types/ProductProfile";
import type { SaveProductDetails } from "../types/SaveProductDetails";

type ProductDetailsPanelProps = {
  product: ProductProfile;
  productDetailsState: ProductDetailsState;
  saveProductDetails: SaveProductDetails;
};

export const ProductDetailsPanel = ({
  product,
  productDetailsState,
  saveProductDetails,
}: ProductDetailsPanelProps) => {
  const [draft, setDraft] = useState<ProductDetailsDraft>({
    audience: product.audience,
    colors: product.colors,
    competitors: product.competitors,
    description: product.description,
    externalLinks: product.externalLinks,
    features: product.features,
    name: product.name,
    niche: product.niche,
    offers: product.offers,
    pricing: product.pricing,
    websiteUrl: product.websiteUrl,
  });

  return (
    <section className="rounded-lg border border-black/10 bg-white p-4 shadow-sm">
      <SectionTitle title="Product details" />
      <p className="mt-2 text-sm leading-6 text-black/60">
        Keep these details accurate so every article understands what you sell.
      </p>
      <form
        className="mt-4 grid gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          void Promise.resolve(saveProductDetails(draft)).catch(() => undefined);
        }}
      >
        <div className="grid gap-3 md:grid-cols-2">
          <TextField
            id="product-name"
            label="Product name"
            onChange={(event) =>
              setDraft((current) => ({ ...current, name: event.target.value }))
            }
            value={draft.name}
          />
          <TextField
            id="product-website-url"
            label="Website"
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                websiteUrl: event.target.value,
              }))
            }
            value={draft.websiteUrl}
          />
          <TextField
            id="product-niche-details"
            label="Niche"
            onChange={(event) =>
              setDraft((current) => ({ ...current, niche: event.target.value }))
            }
            value={draft.niche}
          />
          <TextField
            id="product-audience"
            label="Audience"
            onChange={(event) =>
              setDraft((current) => ({ ...current, audience: event.target.value }))
            }
            value={draft.audience}
          />
        </div>
        <label className="grid gap-2 text-sm font-medium text-black" htmlFor="product-description">
          Description
          <textarea
            className="min-h-32 resize-y rounded-md border border-black/15 bg-white p-3 text-sm font-normal leading-6 text-black outline-none focus:border-black"
            id="product-description"
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                description: event.target.value,
              }))
            }
            value={draft.description}
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-black" htmlFor="product-competitors">
          Competitors
          <textarea
            className="min-h-24 resize-y rounded-md border border-black/15 bg-white p-3 text-sm font-normal leading-6 text-black outline-none focus:border-black"
            id="product-competitors"
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                competitors: event.target.value,
              }))
            }
            placeholder="Add the alternatives your customers compare you with."
            value={draft.competitors}
          />
        </label>
        <StringListEditor
          addLabel="Add feature"
          description="List the useful things your product can do."
          idPrefix="product-feature"
          label="Features"
          onChange={(features) => setDraft((current) => ({ ...current, features }))}
          placeholder="Example: Works offline"
          values={draft.features}
        />
        <ProductPricingEditor
          onChange={(pricing) => setDraft((current) => ({ ...current, pricing }))}
          pricing={draft.pricing}
        />
        <StringListEditor
          addLabel="Add offer"
          description="Include free trials, discounts, free plans, and special offers."
          idPrefix="product-offer"
          label="Trials and offers"
          onChange={(offers) => setDraft((current) => ({ ...current, offers }))}
          placeholder="Example: 14-day free trial"
          values={draft.offers}
        />
        <ProductExternalLinksEditor
          links={draft.externalLinks}
          onChange={(externalLinks) =>
            setDraft((current) => ({ ...current, externalLinks }))
          }
        />
        <StringListEditor
          addLabel="Add color"
          description="Use the brand colors you want reflected in generated images."
          idPrefix="product-color"
          label="Brand colors"
          onChange={(colors) => setDraft((current) => ({ ...current, colors }))}
          placeholder="#000000"
          values={draft.colors}
        />
        <div className="flex flex-wrap items-center gap-3">
          <PrimaryButton disabled={productDetailsState.isSaving} type="submit">
            <Save size={16} aria-hidden="true" />
            {productDetailsState.isSaving ? "Saving" : "Save product details"}
          </PrimaryButton>
          {productDetailsState.message ? (
            <p className="text-sm font-medium text-black" aria-live="polite">
              {productDetailsState.message}
            </p>
          ) : null}
        </div>
      </form>
    </section>
  );
};
