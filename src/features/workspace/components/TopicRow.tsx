"use client";

import { useState } from "react";
import { StatusBadge } from "./StatusBadge";
import { TopicBriefButton } from "./TopicBriefButton";
import { TopicBriefDialog } from "./TopicBriefDialog";
import { TopicDeleteButton } from "./TopicDeleteButton";
import { TopicRepurposeButton } from "./TopicRepurposeButton";
import { TopicRepurposeDialog } from "./TopicRepurposeDialog";
import { TopicWriteButton } from "./TopicWriteButton";
import { countTopicArticles } from "../utils/countTopicArticles";
import type { TopicItem } from "../types/TopicItem";
import type { WriteBlogOptions } from "../types/WriteBlogOptions";

type TopicRowProps = {
  deleteTopic: (topicId: string) => Promise<void> | void;
  refreshTopicBrief: (topicId: string) => Promise<string>;
  topic: TopicItem;
  writeBlog: (
    topicId: string,
    options?: WriteBlogOptions,
  ) => Promise<void> | void;
};

export const TopicRow = ({
  deleteTopic,
  refreshTopicBrief,
  topic,
  writeBlog,
}: TopicRowProps) => {
  const [isBriefOpen, setIsBriefOpen] = useState(false);
  const [isRepurposeOpen, setIsRepurposeOpen] = useState(false);
  const isWriting = topic.status === "writing";
  const hasBrief = Boolean(topic.notes?.trim());
  const articleCount = countTopicArticles(topic);

  return (
    <article className="grid gap-4 border-b border-black/10 bg-white p-4 last:border-b-0 xl:grid-cols-[minmax(0,1fr)_120px_90px_480px] xl:items-center">
      <div className="min-w-0">
        <p className="text-sm font-semibold leading-6 text-black">
          {topic.keyword}
        </p>
        {topic.notes ? (
          <p className="mt-1 line-clamp-2 text-sm leading-6 text-black/60">
            {topic.notes}
          </p>
        ) : null}
      </div>
      <div>
        <p className="mb-1 text-xs font-semibold text-black/50 xl:hidden">
          Status
        </p>
        <StatusBadge status={topic.status} />
      </div>
      <div>
        <p className="mb-1 text-xs font-semibold text-black/50 xl:hidden">
          Articles
        </p>
        <p className="text-sm font-medium text-black">{articleCount}</p>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row xl:justify-end">
        <TopicBriefButton
          disabled={isWriting}
          hasBrief={hasBrief}
          onOpen={() => setIsBriefOpen(true)}
        />
        <TopicRepurposeButton
          disabled={isWriting}
          onOpen={() => setIsRepurposeOpen(true)}
        />
        <TopicWriteButton
          disabled={isWriting}
          onWrite={() => {
            void Promise.resolve(writeBlog(topic.id)).catch(() => undefined);
          }}
        />
        <TopicDeleteButton
          onDelete={() => Promise.resolve(deleteTopic(topic.id))}
        />
      </div>
      {isBriefOpen ? (
        <TopicBriefDialog
          key={topic.id}
          onClose={() => setIsBriefOpen(false)}
          refreshTopicBrief={refreshTopicBrief}
          topic={topic}
        />
      ) : null}
      <TopicRepurposeDialog
        isOpen={isRepurposeOpen}
        onClose={() => setIsRepurposeOpen(false)}
        onRepurpose={(sourceText) => writeBlog(topic.id, { sourceText })}
        topic={topic}
      />
    </article>
  );
};
