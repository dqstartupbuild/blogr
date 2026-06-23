"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { PrimaryButton } from "./PrimaryButton";
import { TextField } from "./TextField";

type TopicCreatorProps = {
  addTopic: (keyword: string, notes?: string) => void | Promise<void>;
};

export const TopicCreator = ({ addTopic }: TopicCreatorProps) => {
  const [keyword, setKeyword] = useState("");

  return (
    <form
      className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]"
      onSubmit={(event) => {
        event.preventDefault();
        addTopic(keyword);
        setKeyword("");
      }}
    >
      <TextField
        id="keyword"
        label="Keyword"
        onChange={(event) => setKeyword(event.target.value)}
        placeholder="best project planning tool"
        value={keyword}
      />
      <div className="flex items-end">
        <PrimaryButton type="submit">
          <Plus size={16} aria-hidden="true" />
          Save topic
        </PrimaryButton>
      </div>
    </form>
  );
};
