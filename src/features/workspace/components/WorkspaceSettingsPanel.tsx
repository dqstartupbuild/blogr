"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { articleStyleValues } from "../constants/articleStyleValues";
import { imageStyleOptions } from "../constants/imageStyleOptions";
import { imagesPerArticleOptions } from "../constants/imagesPerArticleOptions";
import { internalLinkCountOptions } from "../constants/internalLinkCountOptions";
import { settingsToggleOptions } from "../constants/settingsToggleOptions";
import type { ArticleStyle } from "../types/ArticleStyle";
import type { BlogGenerationSettings } from "../types/BlogGenerationSettings";
import type { ImageStyle } from "../types/ImageStyle";
import type { ImagesPerArticle } from "../types/ImagesPerArticle";
import type { InternalLinksPerArticle } from "../types/InternalLinksPerArticle";
import { PrimaryButton } from "./PrimaryButton";
import { SectionTitle } from "./SectionTitle";
import { SettingsFormSection } from "./SettingsFormSection";
import { SettingsSaveStatus } from "./SettingsSaveStatus";
import { SettingsSelectField } from "./SettingsSelectField";
import { SettingsTextareaField } from "./SettingsTextareaField";
import { SettingsToggleField } from "./SettingsToggleField";

type WorkspaceSettingsPanelProps = {
  isSaving: boolean;
  saveSettings: (settings: BlogGenerationSettings) => Promise<void> | void;
  settings: BlogGenerationSettings;
  statusMessage: string;
};

export const WorkspaceSettingsPanel = ({
  isSaving,
  saveSettings,
  settings,
  statusMessage,
}: WorkspaceSettingsPanelProps) => {
  const [draft, setDraft] = useState(settings);
  const selectedImageStyle = imageStyleOptions.find(
    (option) => option.value === draft.imageStyle,
  );

  return (
    <section className="rounded-lg border border-black bg-white p-4">
      <SectionTitle title="Article settings" />
      <form
        className="mt-4 grid gap-5"
        onSubmit={async (event) => {
          event.preventDefault();
          await saveSettings(draft);
        }}
      >
        <SettingsFormSection
          description="Pick the voice your articles should use."
          title="Article style"
        >
          <SettingsSelectField
            id="article-style"
            label="Style"
            onChange={(value) =>
              setDraft((current) => ({
                ...current,
                articleStyle: value as ArticleStyle,
              }))
            }
            options={articleStyleValues.map((value) => ({
              label: value,
              value,
            }))}
            value={draft.articleStyle}
          />
        </SettingsFormSection>
        <SettingsFormSection
          description="Add your own rules for every article, like brand voice, words to avoid, or details to mention."
          title="Global article settings"
        >
          <SettingsTextareaField
            description="Leave this blank if you do not have extra writing rules."
            id="global-article-settings"
            label="Writing rules"
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                globalArticleInstructions: event.target.value,
              }))
            }
            placeholder="Example: Keep the tone warm. Avoid buzzwords. Mention our free trial when it fits."
            value={draft.globalArticleInstructions}
          />
        </SettingsFormSection>
        <SettingsFormSection
          description="Choose how many links from your site can be added to each article."
          title="Internal links"
        >
          <SettingsSelectField
            id="internal-links"
            label="Links per article"
            onChange={(value) =>
              setDraft((current) => ({
                ...current,
                internalLinksPerArticle: Number(value) as InternalLinksPerArticle,
              }))
            }
            options={internalLinkCountOptions.map((value) => ({
              label: `${value}`,
              value,
            }))}
            value={draft.internalLinksPerArticle}
          />
        </SettingsFormSection>
        <SettingsFormSection
          description="Set the look for article images, including the feature image."
          title="Image style"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <SettingsSelectField
              description={selectedImageStyle?.description}
              id="image-style"
              label="Image look"
              onChange={(value) =>
                setDraft((current) => ({
                  ...current,
                  imageStyle: value as ImageStyle,
                }))
              }
              options={imageStyleOptions}
              value={draft.imageStyle}
            />
            <SettingsSelectField
              id="images-per-article"
              label="Images per article"
              onChange={(value) =>
                setDraft((current) => ({
                  ...current,
                  imagesPerArticle: value as ImagesPerArticle,
                }))
              }
              options={imagesPerArticleOptions}
              value={draft.imagesPerArticle}
            />
          </div>
        </SettingsFormSection>
        <SettingsFormSection
          description="Turn on the extras you want the writer to include."
          title="Article extras"
        >
          <div className="grid gap-3 md:grid-cols-2">
            {settingsToggleOptions.map((option) => (
              <SettingsToggleField
                checked={draft[option.key]}
                description={option.description}
                id={`setting-${option.key}`}
                key={option.key}
                label={option.label}
                onChange={(checked) =>
                  setDraft((current) => ({
                    ...current,
                    [option.key]: checked,
                  }))
                }
              />
            ))}
          </div>
        </SettingsFormSection>
        <div className="flex flex-wrap items-center gap-3">
          <PrimaryButton disabled={isSaving} type="submit">
            <Save size={16} aria-hidden="true" />
            {isSaving ? "Saving" : "Save settings"}
          </PrimaryButton>
          <SettingsSaveStatus message={statusMessage} />
        </div>
      </form>
    </section>
  );
};
