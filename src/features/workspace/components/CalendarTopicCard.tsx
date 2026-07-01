"use client";

import { useState } from "react";
import {
  ClipboardPen,
  Eye,
  FileSearch,
  Link2Off,
  Pencil,
  Sparkles,
} from "lucide-react";
import { CalendarTopicActionButton } from "./CalendarTopicActionButton";
import { CalendarTopicDeleteButton } from "./CalendarTopicDeleteButton";
import { StatusBadge } from "./StatusBadge";
import { TopicBriefDialog } from "./TopicBriefDialog";
import { TopicRepurposeDialog } from "./TopicRepurposeDialog";
import { TopicSourceBadge } from "./TopicSourceBadge";
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
    <div className="grid min-w-0 gap-1 rounded-md border border-black/10 bg-black/[0.03] p-1 sm:gap-2 sm:p-2">
      <div className="grid min-w-0 gap-1 sm:gap-2">
        <div className="hidden flex-wrap items-center gap-2 sm:flex">
          <StatusBadge status={topic.status} />
          <TopicSourceBadge sourceType={topic.sourceType} />
        </div>
        <p className="line-clamp-3 min-w-0 break-words text-[11px] font-semibold leading-4 text-black sm:text-sm sm:leading-5">
          {topic.keyword}
        </p>
        {topic.notes ? (
          <p className="hidden text-xs leading-5 text-black/60 md:line-clamp-2">
            {topic.notes}
          </p>
        ) : null}
      </div>
      <div className="flex min-w-0 flex-wrap gap-1 sm:gap-1.5">
        {topic.blogId ? (
          <CalendarTopicActionButton
            label="Open article"
            onClick={() => openBlogPreview(topic.blogId || "")}
          >
            <Eye size={15} aria-hidden="true" />
          </CalendarTopicActionButton>
        ) : null}
        <CalendarTopicActionButton
          disabled={isWriting}
          label={hasBrief ? "Edit brief" : "Find brief"}
          onClick={() => setIsBriefOpen(true)}
        >
          {hasBrief ? (
            <Pencil size={15} aria-hidden="true" />
          ) : (
            <FileSearch size={15} aria-hidden="true" />
          )}
        </CalendarTopicActionButton>
        <CalendarTopicActionButton
          disabled={isWriting}
          label="Repurpose"
          onClick={() => setIsRepurposeOpen(true)}
        >
          <ClipboardPen size={15} aria-hidden="true" />
        </CalendarTopicActionButton>
        <CalendarTopicActionButton
          disabled={isWriting}
          label="Write blog"
          onClick={() => {
            void Promise.resolve(writeBlog(topic.id)).catch(() => undefined);
          }}
        >
          <Sparkles size={15} aria-hidden="true" />
        </CalendarTopicActionButton>
        <CalendarTopicActionButton
          label="Remove from calendar"
          onClick={() => {
            void Promise.resolve(removeTopicFromCalendar(topic.id)).catch(
              () => undefined,
            );
          }}
        >
          <Link2Off size={15} aria-hidden="true" />
        </CalendarTopicActionButton>
        <CalendarTopicDeleteButton deleteTopic={() => deleteTopic(topic.id)} />
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
