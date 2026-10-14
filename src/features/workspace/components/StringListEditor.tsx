"use client";

import { Plus, Trash2 } from "lucide-react";
import { SecondaryButton } from "./SecondaryButton";

type StringListEditorProps = {
  addLabel: string;
  description: string;
  idPrefix: string;
  label: string;
  onChange: (values: string[]) => void;
  placeholder: string;
  values: string[];
};

export const StringListEditor = ({
  addLabel,
  description,
  idPrefix,
  label,
  onChange,
  placeholder,
  values,
}: StringListEditorProps) => {
  return (
    <div className="grid gap-3 rounded-md border border-black/10 p-4">
      <div>
        <h3 className="text-sm font-semibold text-black">{label}</h3>
        <p className="mt-1 text-xs leading-5 text-black/60">{description}</p>
      </div>
      {values.map((value, index) => (
        <div className="flex items-center gap-2" key={`${idPrefix}-${index}`}>
          <label className="sr-only" htmlFor={`${idPrefix}-${index}`}>
            {label} {index + 1}
          </label>
          <input
            className="h-10 min-w-0 flex-1 rounded-md border border-black/15 bg-white px-3 text-sm text-black outline-none focus:border-black"
            id={`${idPrefix}-${index}`}
            onChange={(event) =>
              onChange(
                values.map((item, itemIndex) =>
                  itemIndex === index ? event.target.value : item,
                ),
              )
            }
            placeholder={placeholder}
            value={value}
          />
          <button
            aria-label={`Remove ${label.toLowerCase()} ${index + 1}`}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-black/15 bg-white text-black transition hover:border-black hover:bg-black hover:text-white"
            onClick={() => onChange(values.filter((_, itemIndex) => itemIndex !== index))}
            type="button"
          >
            <Trash2 size={16} aria-hidden="true" />
          </button>
        </div>
      ))}
      <div>
        <SecondaryButton onClick={() => onChange([...values, ""])} type="button">
          <Plus size={16} aria-hidden="true" />
          {addLabel}
        </SecondaryButton>
      </div>
    </div>
  );
};
