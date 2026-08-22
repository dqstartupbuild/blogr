import type { BlogPublishArticle } from "./BlogPublishArticle";
import type { BlogPublishEventType } from "./BlogPublishEventType";

export type BlogPublishPayload = {
  data: {
    article?: BlogPublishArticle;
    articles?: BlogPublishArticle[];
  };
  event_type: BlogPublishEventType;
  timestamp: string;
};
