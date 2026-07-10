"use client";

import { Plus, Trash2 } from "lucide-react";
import { SecondaryButton } from "./SecondaryButton";
import type { ProductExternalLink } from "../types/ProductExternalLink";

type ProductExternalLinksEditorProps = {
  links: ProductExternalLink[];
  onChange: (links: ProductExternalLink[]) => void;
};

export const ProductExternalLinksEditor = ({
  links,
  onChange,
}: ProductExternalLinksEditorProps) => {
  return (
    <div className="grid gap-3 rounded-md border border-black/10 p-4">
      <div>
        <h3 className="text-sm font-semibold text-black">App and extension links</h3>
        <p className="mt-1 text-xs leading-5 text-black/60">
          Add places where people can get your app, extension, or integration.
        </p>
      </div>
      {links.map((link, index) => (
        <div
          className="grid gap-2 md:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)_auto]"
          key={`product-external-link-${index}`}
        >
          <input
            aria-label={`External link ${index + 1} label`}
            className="h-10 rounded-md border border-black/15 bg-white px-3 text-sm text-black outline-none focus:border-black"
            onChange={(event) =>
              onChange(
                links.map((item, itemIndex) =>
                  itemIndex === index ? { ...item, label: event.target.value } : item,
                ),
              )
            }
            placeholder="Apple App Store"
            value={link.label}
          />
          <input
            aria-label={`External link ${index + 1} URL`}
            className="h-10 rounded-md border border-black/15 bg-white px-3 text-sm text-black outline-none focus:border-black"
            onChange={(event) =>
              onChange(
                links.map((item, itemIndex) =>
                  itemIndex === index ? { ...item, url: event.target.value } : item,
                ),
              )
            }
            placeholder="https://apps.apple.com/..."
            type="url"
            value={link.url}
          />
          <button
            aria-label={`Remove external link ${index + 1}`}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-black/15 bg-white text-black transition hover:border-black hover:bg-black hover:text-white"
            onClick={() => onChange(links.filter((_, itemIndex) => itemIndex !== index))}
            type="button"
          >
            <Trash2 size={16} aria-hidden="true" />
          </button>
        </div>
      ))}
      <div>
        <SecondaryButton
          onClick={() => onChange([...links, { label: "", url: "" }])}
          type="button"
        >
          <Plus size={16} aria-hidden="true" />
          Add link
        </SecondaryButton>
      </div>
    </div>
  );
};
