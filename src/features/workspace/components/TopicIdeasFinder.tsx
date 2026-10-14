"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { SecondaryButton } from "./SecondaryButton";
import type { FindTopicIdeas } from "../types/FindTopicIdeas";

type TopicIdeasFinderProps = {
  findTopicIdeas: FindTopicIdeas;
};

export const TopicIdeasFinder = ({ findTopicIdeas }: TopicIdeasFinderProps) => {
  const [isFinding, setIsFinding] = useState(false);
  const [message, setMessage] = useState("");

  const handleFind = () => {
    setIsFinding(true);
    setMessage("Finding up to 30 new topics. This can take a minute.");

    void findTopicIdeas()
      .then(setMessage)
      .catch((error) => {
        setMessage(
          error instanceof Error ? error.message : "Could not find topic ideas yet.",
        );
      })
      .finally(() => setIsFinding(false));
  };

  return (
    <div className="grid gap-2 sm:justify-items-end">
      <SecondaryButton disabled={isFinding} onClick={handleFind} type="button">
        <Sparkles size={16} aria-hidden="true" />
        {isFinding ? "Finding ideas..." : "Find topic ideas"}
      </SecondaryButton>
      {message ? (
        <p aria-live="polite" className="max-w-xs text-sm text-black/65 sm:text-right">
          {message}
        </p>
      ) : null}
    </div>
  );
};
