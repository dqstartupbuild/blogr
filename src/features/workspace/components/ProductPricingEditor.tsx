"use client";

import { Plus, Trash2 } from "lucide-react";
import { SecondaryButton } from "./SecondaryButton";
import type { ProductPrice } from "../types/ProductPrice";

type ProductPricingEditorProps = {
  onChange: (pricing: ProductPrice[]) => void;
  pricing: ProductPrice[];
};

export const ProductPricingEditor = ({
  onChange,
  pricing,
}: ProductPricingEditorProps) => {
  const updatePrice = (index: number, patch: Partial<ProductPrice>) => {
    onChange(
      pricing.map((price, priceIndex) =>
        priceIndex === index ? { ...price, ...patch } : price,
      ),
    );
  };

  return (
    <div className="grid gap-3 rounded-md border border-black/10 p-4">
      <div>
        <h3 className="text-sm font-semibold text-black">Pricing</h3>
        <p className="mt-1 text-xs leading-5 text-black/60">
          Add each plan and the exact price people see.
        </p>
      </div>
      {pricing.map((price, index) => (
        <div
          className="grid gap-2 rounded-md border border-black/10 bg-black/[0.02] p-3 md:grid-cols-2"
          key={`product-price-${index}`}
        >
          <input
            aria-label={`Plan ${index + 1} name`}
            className="h-10 rounded-md border border-black/15 bg-white px-3 text-sm text-black outline-none focus:border-black"
            onChange={(event) => updatePrice(index, { name: event.target.value })}
            placeholder="Plan name"
            value={price.name}
          />
          <input
            aria-label={`Plan ${index + 1} price`}
            className="h-10 rounded-md border border-black/15 bg-white px-3 text-sm text-black outline-none focus:border-black"
            onChange={(event) => updatePrice(index, { price: event.target.value })}
            placeholder="$12"
            value={price.price}
          />
          <input
            aria-label={`Plan ${index + 1} billing period`}
            className="h-10 rounded-md border border-black/15 bg-white px-3 text-sm text-black outline-none focus:border-black"
            onChange={(event) =>
              updatePrice(index, { billingPeriod: event.target.value })
            }
            placeholder="per month"
            value={price.billingPeriod || ""}
          />
          <input
            aria-label={`Plan ${index + 1} details`}
            className="h-10 rounded-md border border-black/15 bg-white px-3 text-sm text-black outline-none focus:border-black"
            onChange={(event) => updatePrice(index, { details: event.target.value })}
            placeholder="For teams up to 10"
            value={price.details || ""}
          />
          <div className="md:col-span-2">
            <SecondaryButton
              onClick={() =>
                onChange(pricing.filter((_, priceIndex) => priceIndex !== index))
              }
              type="button"
            >
              <Trash2 size={16} aria-hidden="true" />
              Remove plan
            </SecondaryButton>
          </div>
        </div>
      ))}
      <div>
        <SecondaryButton
          onClick={() => onChange([...pricing, { name: "", price: "" }])}
          type="button"
        >
          <Plus size={16} aria-hidden="true" />
          Add price
        </SecondaryButton>
      </div>
    </div>
  );
};
