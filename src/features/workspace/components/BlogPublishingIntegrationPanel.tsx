"use client";

import { useVersionedDraft } from "../hooks/useVersionedDraft";
import { Plug, Save, Trash2 } from "lucide-react";
import { emptyBlogPublishingIntegration } from "../constants/emptyBlogPublishingIntegration";
import type { BlogPublishingIntegration } from "../types/integrations/BlogPublishingIntegration";
import type { BlogPublishingIntegrationDraft } from "../types/integrations/BlogPublishingIntegrationDraft";
import { BlogPublishingSetupGuide } from "./BlogPublishingSetupGuide";
import { PrimaryButton } from "./PrimaryButton";
import { SecondaryButton } from "./SecondaryButton";
import { SettingsFormSection } from "./SettingsFormSection";
import { SettingsSaveStatus } from "./SettingsSaveStatus";
import { TextField } from "./TextField";

type BlogPublishingIntegrationPanelProps = {
  integration?: BlogPublishingIntegration;
  isSaving: boolean;
  productName: string;
  saveIntegration: (
    integration: BlogPublishingIntegrationDraft,
    expectedUpdatedAt: number,
  ) => Promise<void> | void;
  statusMessage: string;
  productUpdatedAt: number;
};

export const BlogPublishingIntegrationPanel = ({
  integration = emptyBlogPublishingIntegration,
  isSaving,
  productName,
  saveIntegration,
  statusMessage,
  productUpdatedAt,
}: BlogPublishingIntegrationPanelProps) => {
  const { draft, setDraft, expectedUpdatedAt, hasConflict } = useVersionedDraft<BlogPublishingIntegrationDraft>({
    accessToken: "",
    enabled: integration.enabled,
    sourceName: integration.sourceName || "Blogr",
    webhookUrl: integration.webhookUrl,
  }, productUpdatedAt);

  const handleRemove = async () => {
    await saveIntegration({
      accessToken: "",
      enabled: false,
      sourceName: draft.sourceName || "Blogr",
      webhookUrl: "",
    }, expectedUpdatedAt);
    setDraft({
      accessToken: "",
      enabled: false,
      sourceName: "Blogr",
      webhookUrl: "",
    });
  };

  return (
    <section className="rounded-lg border border-black/10 bg-white p-4 shadow-sm">
      {hasConflict ? <p className="mb-4 text-sm text-red-700" role="alert">Publishing settings changed on another tab. Your edits are still here. Reload to review them before saving.</p> : null}
      <div className="grid gap-5">
        <BlogPublishingSetupGuide productName={productName} />
        <form
          className="grid gap-5 border-t border-black/10 pt-4"
          onSubmit={async (event) => {
            event.preventDefault();
            await saveIntegration({
              ...draft,
              enabled: true,
            }, expectedUpdatedAt);
            setDraft((current) => ({
              ...current,
              accessToken: "",
              enabled: true,
            }));
          }}
        >
          <SettingsFormSection
            description="Connect this product to the blog app that should receive finished posts."
            title="Blog webhook"
          >
            <div className="grid gap-4">
              <TextField
                id="blog-publishing-webhook-url"
                label="Webhook URL"
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    webhookUrl: event.target.value,
                  }))
                }
                placeholder="https://your-site.com/api/webhooks/blog-publisher"
                type="url"
                value={draft.webhookUrl}
              />
              <p className="text-sm leading-6 text-black/60">
                Set <code>BLOG_PUBLISH_WEBHOOK_TOKEN</code> in the local server environment before publishing. The token stays outside your project and backup.
              </p>
              <TextField
                id="blog-publishing-source-name"
                label="Publisher label"
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    sourceName: event.target.value,
                  }))
                }
                placeholder="Blogr"
                value={draft.sourceName}
              />
              <p className="text-xs leading-5 text-black/60">
                This is sent as the webhook payload source so the receiving app
                knows Blogr sent it. It is not the article author.
              </p>
            </div>
          </SettingsFormSection>
          <div className="flex flex-wrap items-center gap-3">
            <PrimaryButton disabled={isSaving} type="submit">
              <Save size={16} aria-hidden="true" />
              {isSaving ? "Saving" : "Save publishing"}
            </PrimaryButton>
            <SecondaryButton
              disabled={isSaving || (!integration.enabled && !draft.webhookUrl)}
              onClick={handleRemove}
              type="button"
            >
              <Trash2 size={16} aria-hidden="true" />
              Remove
            </SecondaryButton>
            <span className="inline-flex items-center gap-2 text-sm font-medium text-black">
              <Plug size={16} aria-hidden="true" />
              {integration.enabled
                ? "Connected for this product."
                : "Not connected."}
            </span>
            <SettingsSaveStatus message={statusMessage} />
          </div>
        </form>
      </div>
    </section>
  );
};
