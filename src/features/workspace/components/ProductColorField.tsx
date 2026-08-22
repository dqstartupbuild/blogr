import { getColorPickerValue } from "../utils/getColorPickerValue";

type ProductColorFieldProps = {
  descriptionId: string;
  id: string;
  onChange: (value: string) => void;
  onRemove: () => void;
  position: number;
  value: string;
};

export const ProductColorField = ({
  descriptionId,
  id,
  onChange,
  onRemove,
  position,
  value,
}: ProductColorFieldProps) => {
  return (
    <div className="grid gap-2">
      <label className="text-sm font-medium text-black" htmlFor={id}>
        Color {position}
      </label>
      <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap">
        <input
          aria-describedby={descriptionId}
          aria-label={`Choose color ${position}`}
          className="size-11 shrink-0 cursor-pointer rounded-md border border-black/15 bg-white p-1 outline-none focus:border-black focus:ring-2 focus:ring-black/15"
          onChange={(event) => onChange(event.target.value)}
          title={`Choose color ${position}`}
          type="color"
          value={getColorPickerValue(value)}
        />
        <input
          aria-describedby={descriptionId}
          className="h-11 min-w-32 flex-1 rounded-md border border-black/15 bg-white px-3 text-sm font-normal text-black outline-none placeholder:text-black/45 focus:border-black"
          id={id}
          onChange={(event) => onChange(event.target.value)}
          placeholder="#000000"
          spellCheck={false}
          type="text"
          value={value}
        />
        <button
          aria-label={`Remove color ${position}`}
          className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-md border border-black/15 bg-white px-3 text-sm font-semibold text-black transition-colors hover:border-black hover:bg-black hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
          onClick={onRemove}
          type="button"
        >
          Remove
        </button>
      </div>
    </div>
  );
};
