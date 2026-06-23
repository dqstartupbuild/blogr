"use client";

import { useState } from "react";
import { StatusBadge } from "./StatusBadge";
import { TopicRepurposeButton } from "./TopicRepurposeButton";
import { TopicRepurposeDialog } from "./TopicRepurposeDialog";
import { TopicWriteButton } from "./TopicWriteButton";
import type { TopicItem } from "../types/TopicItem";
import type { WriteBlogOptions } from "../types/WriteBlogOptions";

type TopicRowProps = {
  topic: TopicItem;
  writeBlog: (
    topicId: string,
    options?: WriteBlogOptions,
  ) => Promise<void> | void;
};

export const TopicRow = ({ topic, writeBlog }: TopicRowProps) => {
  const [isRepurposeOpen, setIsRepurposeOpen] = useState(false);
  const isWriting = topic.status === "writing";

  return (
    <article className="grid gap-3 bg-white p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-black">
          {topic.keyword}
        </p>
        <div className="mt-2">
          <StatusBadge status={topic.status} />
        </div>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
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
      </div>
      <TopicRepurposeDialog
        isOpen={isRepurposeOpen}
        onClose={() => setIsRepurposeOpen(false)}
        onRepurpose={(sourceText) => writeBlog(topic.id, { sourceText })}
        topic={topic}
      />
    </article>
  );
};
