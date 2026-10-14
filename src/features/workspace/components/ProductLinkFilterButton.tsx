import type { ProductLinkFilter } from "../types/ProductLinkFilter";

type ProductLinkFilterButtonProps = {
  count: number;
  filter: ProductLinkFilter;
  label: string;
  onSelect: (filter: ProductLinkFilter) => void;
  selected: boolean;
};

export const ProductLinkFilterButton = ({
  count,
  filter,
  label,
  onSelect,
  selected,
}: ProductLinkFilterButtonProps) => {
  return (
    <button
      aria-pressed={selected}
      className={`rounded-md border px-2 py-1 text-xs font-semibold transition ${
        selected
          ? "border-black bg-black text-white"
          : "border-black/10 bg-white text-black/65 hover:border-black hover:text-black"
      }`}
      onClick={() => onSelect(filter)}
      type="button"
    >
      {count} {label}
    </button>
  );
};
