"use client";

import type { FormEvent } from "react";
import { Search } from "lucide-react";
import { PrimaryButton } from "./PrimaryButton";
import { TextField } from "./TextField";

type TopicDiscoveryFormProps = {
  includeAiAnswers: boolean;
  isFinding: boolean;
  onIncludeAiAnswersChange: (includeAiAnswers: boolean) => void;
  onSeedKeywordChange: (seedKeyword: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  seedKeyword: string;
};

export const TopicDiscoveryForm = ({
  includeAiAnswers,
  isFinding,
  onIncludeAiAnswersChange,
  onSeedKeywordChange,
  onSubmit,
  seedKeyword,
}: TopicDiscoveryFormProps) => {
  return (
    <form className="grid gap-3" onSubmit={onSubmit}>
      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
        <TextField
          id="topic-discovery-seed"
          label="Seed keyword"
          onChange={(event) => onSeedKeywordChange(event.target.value)}
          placeholder="project planning"
          value={seedKeyword}
        />
        <PrimaryButton disabled={isFinding} type="submit">
          <Search size={16} aria-hidden="true" />
          {isFinding ? "Searching..." : "Find ideas"}
        </PrimaryButton>
      </div>
      <label className="flex items-center gap-2 text-sm font-medium text-black">
        <input
          checked={includeAiAnswers}
          className="h-4 w-4 accent-black"
          onChange={(event) => onIncludeAiAnswersChange(event.target.checked)}
          type="checkbox"
        />
        Check AI answers
      </label>
    </form>
  );
};
