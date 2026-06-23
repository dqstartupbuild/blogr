"use client";

import { useState, type FormEvent } from "react";
import { PrimaryButton } from "./PrimaryButton";
import { SecondaryButton } from "./SecondaryButton";
import { TopicDiscoveryForm } from "./TopicDiscoveryForm";
import { TopicDiscoveryInsights } from "./TopicDiscoveryInsights";
import { TopicDiscoveryPlanList } from "./TopicDiscoveryPlanList";
import { TopicDiscoveryReviewList } from "./TopicDiscoveryReviewList";
import { buildTopicDiscoveryIdeaNotes } from "../utils/buildTopicDiscoveryIdeaNotes";
import { buildTopicDiscoveryPlanItems } from "../utils/buildTopicDiscoveryPlanItems";
import type { DiscoverTopicIdeas } from "../types/topicDiscovery/DiscoverTopicIdeas";
import type { TopicDiscoveryPlanItem } from "../types/topicDiscovery/TopicDiscoveryPlanItem";
import type { TopicDiscoveryResult } from "../types/topicDiscovery/TopicDiscoveryResult";

type TopicDiscoveryDialogProps = {
  addTopic: (keyword: string, notes?: string) => Promise<void> | void;
  discoverTopicIdeas: DiscoverTopicIdeas;
  isOpen: boolean;
  onClose: () => void;
};

export const TopicDiscoveryDialog = ({
  addTopic,
  discoverTopicIdeas,
  isOpen,
  onClose,
}: TopicDiscoveryDialogProps) => {
  const [seedKeyword, setSeedKeyword] = useState("");
  const [includeAiAnswers, setIncludeAiAnswers] = useState(false);
  const [discovery, setDiscovery] = useState<TopicDiscoveryResult | null>(null);
  const [selectedTitles, setSelectedTitles] = useState<string[]>([]);
  const [savedPlanItemIds, setSavedPlanItemIds] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [isFinding, setIsFinding] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const selectedIdeas =
    discovery?.ideas.filter((idea) => selectedTitles.includes(idea.title)) || [];
  const planItems = discovery ? buildTopicDiscoveryPlanItems(discovery) : [];

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsFinding(true);
    setMessage("");

    void discoverTopicIdeas({
      includeAiAnswers,
      seedKeyword: seedKeyword.trim() || undefined,
    })
      .then((result) => {
        setDiscovery(result);
        setSelectedTitles(result.ideas.map((idea) => idea.title));
        setSavedPlanItemIds([]);
        setMessage(
          result.ideas.length > 0
            ? "Choose the topics you want to save."
            : "No new topic ideas found yet.",
        );
      })
      .catch((error) => {
        setMessage(
          error instanceof Error
            ? error.message
            : "Could not find topic ideas yet.",
        );
      })
      .finally(() => setIsFinding(false));
  };

  const handleAddTopics = () => {
    setIsAdding(true);
    setMessage("");

    void Promise.all(
      selectedIdeas.map((idea) =>
        Promise.resolve(addTopic(idea.title, buildTopicDiscoveryIdeaNotes(idea))),
      ),
    )
      .then(() => {
        setMessage("Topics added.");
        onClose();
      })
      .catch((error) => {
        setMessage(
          error instanceof Error ? error.message : "Could not add topics yet.",
        );
      })
      .finally(() => setIsAdding(false));
  };

  const toggleTitle = (title: string) => {
    setSelectedTitles((current) =>
      current.includes(title)
        ? current.filter((item) => item !== title)
        : [...current, title],
    );
  };

  const savePlanItem = (item: TopicDiscoveryPlanItem) => {
    setIsAdding(true);
    setMessage("");

    void Promise.resolve(addTopic(item.title, item.notes))
      .then(() => {
        setSavedPlanItemIds((current) => [...current, item.id]);
        setMessage("Plan saved.");
      })
      .catch((error) => {
        setMessage(
          error instanceof Error ? error.message : "Could not save that plan yet.",
        );
      })
      .finally(() => setIsAdding(false));
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 px-4 py-6">
      <div
        aria-modal="true"
        className="grid max-h-full w-full max-w-3xl gap-4 overflow-auto rounded-lg border border-black bg-white p-5"
        role="dialog"
      >
        <div className="grid gap-1">
          <h2 className="text-lg font-semibold text-black">Find topic ideas</h2>
          <p className="text-sm text-black">
            Search Google, review the ideas, and save only the topics you want.
          </p>
        </div>
        <TopicDiscoveryForm
          includeAiAnswers={includeAiAnswers}
          isFinding={isFinding}
          onIncludeAiAnswersChange={setIncludeAiAnswers}
          onSeedKeywordChange={setSeedKeyword}
          onSubmit={handleSubmit}
          seedKeyword={seedKeyword}
        />
        {message ? <p className="text-sm text-black">{message}</p> : null}
        {discovery ? (
          <div className="grid gap-4">
            <TopicDiscoveryReviewList
              ideas={discovery.ideas}
              onToggle={toggleTitle}
              selectedTitles={selectedTitles}
            />
            <TopicDiscoveryPlanList
              items={planItems}
              onSave={savePlanItem}
              savedItemIds={savedPlanItemIds}
            />
            <TopicDiscoveryInsights discovery={discovery} />
          </div>
        ) : null}
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <SecondaryButton disabled={isAdding || isFinding} onClick={onClose}>
            Close
          </SecondaryButton>
          <PrimaryButton
            disabled={selectedIdeas.length === 0 || isAdding || isFinding}
            onClick={handleAddTopics}
            type="button"
          >
            {isAdding ? "Adding..." : "Add topics"}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};
