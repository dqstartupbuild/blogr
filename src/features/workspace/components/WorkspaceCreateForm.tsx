"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { PrimaryButton } from "./PrimaryButton";
import { SecondaryButton } from "./SecondaryButton";
import { TextField } from "./TextField";
import type { CreateProductWorkspaceInput } from "../types/CreateProductWorkspaceInput";

type WorkspaceCreateFormProps = {
  disabled: boolean;
  onCancel: () => void;
  onCreate: (input: CreateProductWorkspaceInput) => Promise<void>;
};

export const WorkspaceCreateForm = ({
  disabled,
  onCancel,
  onCreate,
}: WorkspaceCreateFormProps) => {
  const [name, setName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [niche, setNiche] = useState("");

  return (
    <form
      className="grid w-full gap-3 rounded-lg border border-black bg-white p-3 sm:grid-cols-[minmax(150px,1fr)_minmax(150px,1fr)_minmax(150px,1fr)_auto_auto]"
      onSubmit={async (event) => {
        event.preventDefault();
        await onCreate({ name, niche, websiteUrl });
        setName("");
        setWebsiteUrl("");
        setNiche("");
      }}
    >
      <TextField
        id="workspace-name"
        label="Name"
        onChange={(event) => setName(event.target.value)}
        placeholder="ClearPath"
        value={name}
      />
      <TextField
        id="workspace-website"
        label="Website"
        onChange={(event) => setWebsiteUrl(event.target.value)}
        placeholder="https://your-site.com"
        value={websiteUrl}
      />
      <TextField
        id="workspace-niche"
        label="Niche"
        onChange={(event) => setNiche(event.target.value)}
        placeholder="Who this is for"
        value={niche}
      />
      <div className="flex items-end">
        <PrimaryButton disabled={disabled} type="submit">
          <Check size={16} aria-hidden="true" />
          Create
        </PrimaryButton>
      </div>
      <div className="flex items-end">
        <SecondaryButton disabled={disabled} onClick={onCancel} type="button">
          <X size={16} aria-hidden="true" />
          Cancel
        </SecondaryButton>
      </div>
    </form>
  );
};
