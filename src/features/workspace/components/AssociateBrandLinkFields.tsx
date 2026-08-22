"use client";

import { Trash2 } from "lucide-react";
import { SecondaryButton } from "./SecondaryButton";
import { SettingsTextareaField } from "./SettingsTextareaField";
import { SettingsTextField } from "./SettingsTextField";
import type { AssociateBrandLink } from "../types/AssociateBrandLink";

type AssociateBrandLinkFieldsProps = {
  index: number;
  link: AssociateBrandLink;
  onChange: (index: number, link: AssociateBrandLink) => void;
  onRemove: (index: number) => void;
};

export const AssociateBrandLinkFields = ({
  index,
  link,
  onChange,
  onRemove,
}: AssociateBrandLinkFieldsProps) => {
  const fieldId = `associate-brand-link-${index}`;

  return (
    <fieldset className="grid gap-3 rounded-md border border-black/10 bg-black/[0.02] p-3">
      <div className="grid gap-3 md:grid-cols-2">
        <SettingsTextField
          id={`${fieldId}-title`}
          label="Name"
          onChange={(event) =>
            onChange(index, {
              ...link,
              title: event.target.value,
            })
          }
          placeholder="Partner brand"
          value={link.title}
        />
        <SettingsTextField
          id={`${fieldId}-url`}
          label="Link"
          onChange={(event) =>
            onChange(index, {
              ...link,
              url: event.target.value,
            })
          }
          placeholder="https://partner.com/page"
          type="url"
          value={link.url}
        />
      </div>
      <SettingsTextareaField
        description="Say when this link should help the reader."
        id={`${fieldId}-description`}
        label="What it does"
        onChange={(event) =>
          onChange(index, {
            ...link,
            description: event.target.value,
          })
        }
        placeholder="Example: Good when readers need a simple way to compare plans."
        value={link.description}
      />
      <div>
        <SecondaryButton onClick={() => onRemove(index)} type="button">
          <Trash2 size={16} aria-hidden="true" />
          Remove
        </SecondaryButton>
      </div>
    </fieldset>
  );
};
