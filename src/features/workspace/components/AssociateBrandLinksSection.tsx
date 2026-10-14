"use client";

import { Plus } from "lucide-react";
import { AssociateBrandLinkFields } from "./AssociateBrandLinkFields";
import { SecondaryButton } from "./SecondaryButton";
import { SettingsFormSection } from "./SettingsFormSection";
import type { AssociateBrandLink } from "../types/AssociateBrandLink";

type AssociateBrandLinksSectionProps = {
  links: AssociateBrandLink[];
  onChange: (links: AssociateBrandLink[]) => void;
};

export const AssociateBrandLinksSection = ({
  links,
  onChange,
}: AssociateBrandLinksSectionProps) => {
  const canAddLink = links.length < 5;

  return (
    <SettingsFormSection
      description="Add partner, affiliate, or related brand links the writer can mention only when they truly help the reader."
      title="Associate brand links"
    >
      <div className="grid gap-3">
        {links.map((link, index) => (
          <AssociateBrandLinkFields
            index={index}
            key={index}
            link={link}
            onChange={(itemIndex, nextLink) =>
              onChange(
                links.map((item, currentIndex) =>
                  currentIndex === itemIndex ? nextLink : item,
                ),
              )
            }
            onRemove={(itemIndex) =>
              onChange(
                links.filter((_, currentIndex) => currentIndex !== itemIndex),
              )
            }
          />
        ))}
        {canAddLink ? (
          <SecondaryButton
            onClick={() =>
              onChange([
                ...links,
                {
                  description: "",
                  title: "",
                  url: "",
                },
              ])
            }
            type="button"
          >
            <Plus size={16} aria-hidden="true" />
            Add link
          </SecondaryButton>
        ) : (
          <p className="text-sm text-black/60">You can add up to 5 links.</p>
        )}
      </div>
    </SettingsFormSection>
  );
};
