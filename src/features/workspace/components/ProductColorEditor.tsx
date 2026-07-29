"use client";

import { useId } from "react";
import { ProductColorField } from "./ProductColorField";

type ProductColorEditorProps = {
  onChange: (values: string[]) => void;
  values: string[];
};

export const ProductColorEditor = ({
  onChange,
  values,
}: ProductColorEditorProps) => {
  const idPrefix = useId();
  const descriptionId = `${idPrefix}-description`;

  return (
    <div className="grid gap-3 rounded-md border border-black/10 p-4">
      <fieldset className="grid gap-3">
        <legend className="text-sm font-semibold text-black">Brand colors</legend>
        <p
          className="mt-1 text-pretty text-xs leading-5 text-black/60"
          id={descriptionId}
        >
          Choose colors for generated images. Click a box or type a hex code.
        </p>
        <div className="grid gap-3">
          {values.map((value, index) => (
            <ProductColorField
              descriptionId={descriptionId}
              id={`${idPrefix}-color-${index}`}
              key={`${idPrefix}-color-${index}`}
              onChange={(nextValue) =>
                onChange(
                  values.map((currentValue, valueIndex) =>
                    valueIndex === index ? nextValue : currentValue,
                  ),
                )
              }
              onRemove={() =>
                onChange(values.filter((_, valueIndex) => valueIndex !== index))
              }
              position={index + 1}
              value={value}
            />
          ))}
        </div>
        <div>
          <button
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-black/15 bg-white px-3 text-sm font-semibold text-black transition-colors hover:border-black hover:bg-black hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
            onClick={() => onChange([...values, ""])}
            type="button"
          >
            Add color
          </button>
        </div>
      </fieldset>
    </div>
  );
};
