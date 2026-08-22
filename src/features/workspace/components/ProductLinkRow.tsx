"use client";

import { ExternalLink, PauseCircle, RotateCcw } from "lucide-react";
import { SecondaryButton } from "./SecondaryButton";
import type { LinkItem } from "../types/LinkItem";
import type { SetProductLinkActive } from "../types/SetProductLinkActive";
import { isLinkActive } from "../utils/isLinkActive";

type ProductLinkRowProps = {
  link: LinkItem;
  setProductLinkActive: SetProductLinkActive;
};

export const ProductLinkRow = ({
  link,
  setProductLinkActive,
}: ProductLinkRowProps) => {
  const active = isLinkActive(link);

  return (
    <li className="grid gap-3 border-t border-black/10 py-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
      <div className="min-w-0">
        <a
          className="inline-flex max-w-full items-center gap-2 truncate text-sm font-semibold text-black underline-offset-4 hover:underline"
          href={link.url}
          rel="noreferrer"
          target="_blank"
        >
          <ExternalLink size={15} aria-hidden="true" />
          <span className="truncate">{link.title || link.url}</span>
        </a>
        <p className="mt-1 truncate text-xs text-black/55">{link.url}</p>
        {link.reason ? (
          <p className="mt-1 text-xs leading-5 text-black/60">{link.reason}</p>
        ) : null}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-md border border-black/10 px-2 py-1 text-xs font-semibold text-black/65">
          {active ? "Can use" : "Do not use"}
        </span>
        <SecondaryButton
          onClick={() => setProductLinkActive(link.url, !active)}
          type="button"
        >
          {active ? (
            <PauseCircle size={16} aria-hidden="true" />
          ) : (
            <RotateCcw size={16} aria-hidden="true" />
          )}
          {active ? "Do not use" : "Use again"}
        </SecondaryButton>
      </div>
    </li>
  );
};
