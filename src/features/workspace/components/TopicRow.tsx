import { Sparkles } from "lucide-react";
import { SecondaryButton } from "./SecondaryButton";
import { StatusBadge } from "./StatusBadge";
import type { TopicItem } from "../types/TopicItem";

type TopicRowProps = {
  topic: TopicItem;
  writeBlog: (topicId: string) => Promise<void> | void;
};

export const TopicRow = ({ topic, writeBlog }: TopicRowProps) => {
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
      <SecondaryButton
        disabled={topic.status === "writing"}
        onClick={() => {
          void Promise.resolve(writeBlog(topic.id)).catch(() => undefined);
        }}
        type="button"
      >
        <Sparkles size={16} aria-hidden="true" />
        Write blog
      </SecondaryButton>
    </article>
  );
};
