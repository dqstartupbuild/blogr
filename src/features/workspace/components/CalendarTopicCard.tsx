"use client";

import { useState } from "react";
import { Eye, Link2Off } from "lucide-react";
import { DeleteActionButton } from "./DeleteActionButton";
import { StatusBadge } from "./StatusBadge";
import { TopicBriefButton } from "./TopicBriefButton";
import { TopicBriefDialog } from "./TopicBriefDialog";
import { TopicRepurposeButton } from "./TopicRepurposeButton";
import { TopicRepurposeDialog } from "./TopicRepurposeDialog";
import { TopicSourceBadge } from "./TopicSourceBadge";
import { TopicWriteButton } from "./TopicWriteButton";
import type { DeleteTopic } from "../types/DeleteTopic";
import type { RemoveTopicFromCalendar } from "../types/RemoveTopicFromCalendar";
import type { SaveTopicBrief } from "../types/SaveTopicBrief";
import type { TopicItem } from "../types/TopicItem";
import type { WriteBlogOptions } from "../types/WriteBlogOptions";

type CalendarTopicCardProps = {
  deleteTopic: DeleteTopic;
  openBlogPreview: (blogId: string) => void;
  refreshTopicBrief: (topicId: string) => Promise<string>;
  removeTopicFromCalendar: RemoveTopicFromCalendar;
  saveTopicBrief: SaveTopicBrief;
  topic: TopicItem;
  writeBlog: (
    topicId: string,
    options?: WriteBlogOptions,
  ) => Promise<void> | void;
};

export const CalendarTopicCard = ({
  deleteTopic,
  openBlogPreview,
  refreshTopicBrief,
  removeTopicFromCalendar,
  saveTopicBrief,
  topic,
  writeBlog,
}: CalendarTopicCardProps) => {
  const [isBriefOpen, setIsBriefOpen] = useState(false);
  const [isRepurposeOpen, setIsRepurposeOpen] = useState(false);
  const isWriting = topic.status === "writing";
  const hasBrief = Boolean(topic.notes?.trim());

  return (
    <div className="grid min-h-40 gap-3 rounded-lg border border-black/10 bg-white p-3 shadow-sm">
      <div className="grid gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={topic.status} />
          <TopicSourceBadge sourceType={topic.sourceType} />
        </div>
        <p className="text-sm font-semibold leading-6 text-black">
          {topic.keyword}
        </p>
        {topic.notes ? (
          <p className="line-clamp-3 text-sm leading-6 text-black/60">
            {topic.notes}
          </p>
        ) : null}
      </div>
      <div className="flex flex-wrap gap-2">
        {topic.blogId ? (
          <button
            className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-black/15 bg-white px-3 text-sm font-semibold text-black transition hover:border-black hover:bg-black hover:text-white"
            onClick={() => openBlogPreview(topic.blogId || "")}
            type="button"
          >
            <Eye size={15} aria-hidden="true" />
            Article
          </button>
        ) : null}
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
        <button
          className="inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-md border border-black/15 bg-white px-4 text-sm font-semibold text-black shadow-sm transition hover:border-black hover:bg-black hover:text-white"
          onClick={() => {
            void Promise.resolve(removeTopicFromCalendar(topic.id)).catch(
              () => undefined,
            );
          }}
          type="button"
        >
          <Link2Off size={16} aria-hidden="true" />
          Remove
        </button>
        <DeleteActionButton
          confirmMessage="Delete this topic? Articles already created from it will stay in Articles."
          label="Delete"
          onDelete={() => deleteTopic(topic.id)}
        />
      </div>
      {isBriefOpen ? (
        <TopicBriefDialog
          key={topic.id}
          onClose={() => setIsBriefOpen(false)}
          refreshTopicBrief={refreshTopicBrief}
          saveTopicBrief={saveTopicBrief}
          topic={topic}
        />
      ) : null}
      <TopicRepurposeDialog
        isOpen={isRepurposeOpen}
        onClose={() => setIsRepurposeOpen(false)}
        onRepurpose={(sourceText) => writeBlog(topic.id, { sourceText })}
        topic={topic}
      />
    </div>
  );
};
