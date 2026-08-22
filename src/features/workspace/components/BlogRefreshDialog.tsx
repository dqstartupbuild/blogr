"use client";

import { useState, type FormEvent } from "react";
import { Search } from "lucide-react";
import { BlogRefreshPlanRow } from "./BlogRefreshPlanRow";
import { PrimaryButton } from "./PrimaryButton";
import { SecondaryButton } from "./SecondaryButton";
import { TextField } from "./TextField";
import { buildBlogRefreshSeedKeyword } from "../utils/buildBlogRefreshSeedKeyword";
import { buildTopicDiscoveryPlanItems } from "../utils/buildTopicDiscoveryPlanItems";
import type { ApplyDiscoveryPlan } from "../types/ApplyDiscoveryPlan";
import type { BlogItem } from "../types/BlogItem";
import type { DiscoverBlogRefreshIdeas } from "../types/DiscoverBlogRefreshIdeas";
import type { SaveDiscoveryPlan } from "../types/SaveDiscoveryPlan";
import type { TopicDiscoveryResult } from "../types/topicDiscovery/TopicDiscoveryResult";

type BlogRefreshDialogProps = {
  applyPlan?: ApplyDiscoveryPlan;
  blog: BlogItem;
  discoverBlogRefreshIdeas: DiscoverBlogRefreshIdeas;
  isOpen: boolean;
  onClose: () => void;
  savePlan?: SaveDiscoveryPlan;
};

export const BlogRefreshDialog = ({
  applyPlan,
  blog,
  discoverBlogRefreshIdeas,
  isOpen,
  onClose,
  savePlan,
}: BlogRefreshDialogProps) => {
  const [seedKeyword, setSeedKeyword] = useState(buildBlogRefreshSeedKeyword(blog));
  const [includeAiAnswers, setIncludeAiAnswers] = useState(false);
  const [discovery, setDiscovery] = useState<TopicDiscoveryResult | null>(null);
  const [savedPlanIds, setSavedPlanIds] = useState<string[]>([]);
  const [appliedPlanIds, setAppliedPlanIds] = useState<string[]>([]);
  const [busyPlanIds, setBusyPlanIds] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [message, setMessage] = useState("");
  const planItems = discovery ? buildTopicDiscoveryPlanItems(discovery) : [];

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSearching(true);
    setMessage("");

    void discoverBlogRefreshIdeas(blog.id, {
      includeAiAnswers,
      seedKeyword: seedKeyword.trim() || buildBlogRefreshSeedKeyword(blog),
    })
      .then((result) => {
        setDiscovery(result);
        setSavedPlanIds([]);
        setAppliedPlanIds([]);
        setBusyPlanIds([]);
        setMessage(
          buildTopicDiscoveryPlanItems(result).length > 0
            ? "Review the plans you want to use."
            : "No refresh ideas found yet.",
        );
      })
      .catch((error) => {
        setMessage(
          error instanceof Error
            ? error.message
            : "Could not find refresh ideas yet.",
        );
      })
      .finally(() => setIsSearching(false));
  };

  const handleSave = (item: (typeof planItems)[number]) => {
    if (!savePlan) return;

    setBusyPlanIds((current) => [...current, item.id]);
    void Promise.resolve()
      .then(() => savePlan(item))
      .then(() => {
        setSavedPlanIds((current) => [...current, item.id]);
        setMessage("Plan saved.");
      })
      .catch((error) => {
        setMessage(
          error instanceof Error ? error.message : "Could not save that plan.",
        );
      })
      .finally(() => {
        setBusyPlanIds((current) => current.filter((id) => id !== item.id));
      });
  };

  const handleApply = (item: (typeof planItems)[number]) => {
    if (!applyPlan) return;

    setBusyPlanIds((current) => [...current, item.id]);
    void Promise.resolve()
      .then(() => applyPlan(item))
      .then(() => {
        setAppliedPlanIds((current) => [...current, item.id]);
        setMessage("Plan added to the draft.");
      })
      .catch((error) => {
        setMessage(
          error instanceof Error ? error.message : "Could not add that plan.",
        );
      })
      .finally(() => {
        setBusyPlanIds((current) => current.filter((id) => id !== item.id));
      });
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
          <h2 className="text-lg font-semibold text-black">Refresh ideas</h2>
          <p className="text-sm text-black">{blog.title}</p>
        </div>
        <form className="grid gap-3" onSubmit={handleSubmit}>
          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
            <TextField
              id={`blog-refresh-seed-${blog.id}`}
              label="Search keyword"
              onChange={(event) => setSeedKeyword(event.target.value)}
              value={seedKeyword}
            />
            <PrimaryButton disabled={isSearching} type="submit">
              <Search size={16} aria-hidden="true" />
              {isSearching ? "Searching..." : "Find ideas"}
            </PrimaryButton>
          </div>
          <label className="flex items-center gap-2 text-sm font-medium text-black">
            <input
              checked={includeAiAnswers}
              className="h-4 w-4 accent-black"
              onChange={(event) => setIncludeAiAnswers(event.target.checked)}
              type="checkbox"
            />
            Check AI answers
          </label>
        </form>
        {message ? <p className="text-sm text-black">{message}</p> : null}
        {planItems.length > 0 ? (
          <div className="rounded-md border border-black px-3">
            {planItems.map((item) => (
              <BlogRefreshPlanRow
                isApplied={appliedPlanIds.includes(item.id)}
                isBusy={busyPlanIds.includes(item.id)}
                isSaved={savedPlanIds.includes(item.id)}
                item={item}
                key={item.id}
                onApply={applyPlan ? handleApply : undefined}
                onSave={savePlan ? handleSave : undefined}
              />
            ))}
          </div>
        ) : null}
        <div className="flex justify-end">
          <SecondaryButton disabled={isSearching} onClick={onClose}>
            Close
          </SecondaryButton>
        </div>
      </div>
    </div>
  );
};
