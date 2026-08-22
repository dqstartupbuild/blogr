"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { ProductLinkFilterButton } from "./ProductLinkFilterButton";
import { ProductLinkRow } from "./ProductLinkRow";
import { SecondaryButton } from "./SecondaryButton";
import { SectionTitle } from "./SectionTitle";
import type { LinkItem } from "../types/LinkItem";
import type { ProductLinksState } from "../types/ProductLinksState";
import type { RefreshProductLinks } from "../types/RefreshProductLinks";
import type { SetProductLinkActive } from "../types/SetProductLinkActive";
import type { ProductLinkFilter } from "../types/ProductLinkFilter";
import { filterProductLinksByStatus } from "../utils/filterProductLinksByStatus";
import { isLinkActive } from "../utils/isLinkActive";

type ProductLinksPanelProps = {
  links: LinkItem[];
  productLinksState: ProductLinksState;
  refreshProductLinks: RefreshProductLinks;
  setProductLinkActive: SetProductLinkActive;
};

export const ProductLinksPanel = ({
  links,
  productLinksState,
  refreshProductLinks,
  setProductLinkActive,
}: ProductLinksPanelProps) => {
  const [filter, setFilter] = useState<ProductLinkFilter>("active");
  const activeCount = links.filter(isLinkActive).length;
  const pausedCount = links.length - activeCount;
  const visibleLinks = filterProductLinksByStatus(links, filter);

  return (
    <section className="rounded-lg border border-black/10 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <SectionTitle title="Scanned links" />
          <p className="mt-2 text-sm leading-6 text-black/60">
            Choose which scanned pages the writer is allowed to use in blogs.
          </p>
        </div>
        <SecondaryButton
          disabled={productLinksState.isRefreshing}
          onClick={refreshProductLinks}
          type="button"
        >
          <RefreshCw size={16} aria-hidden="true" />
          {productLinksState.isRefreshing ? "Refreshing" : "Refresh links"}
        </SecondaryButton>
      </div>
      <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-black/65">
        <ProductLinkFilterButton
          count={activeCount}
          filter="active"
          label="can use"
          onSelect={setFilter}
          selected={filter === "active"}
        />
        <ProductLinkFilterButton
          count={pausedCount}
          filter="inactive"
          label="do not use"
          onSelect={setFilter}
          selected={filter === "inactive"}
        />
      </div>
      {productLinksState.message ? (
        <p className="mt-3 text-sm font-medium text-black" aria-live="polite">
          {productLinksState.message}
        </p>
      ) : null}
      {visibleLinks.length > 0 ? (
        <ul className="mt-3 max-h-96 overflow-y-auto">
          {visibleLinks.map((link) => (
            <ProductLinkRow
              key={link.url}
              link={link}
              setProductLinkActive={setProductLinkActive}
            />
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm leading-6 text-black/60">
          {links.length === 0
            ? "Scan your site to find links."
            : filter === "active"
              ? "No links are currently available to use."
              : "No links are marked do not use."}
        </p>
      )}
    </section>
  );
};
