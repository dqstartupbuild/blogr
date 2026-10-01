import type { BlogItem } from "@/features/workspace/types/BlogItem";
import type { ArticleVersionItem } from "@/features/workspace/types/ArticleVersionItem";
import type { TopicItem } from "@/features/workspace/types/TopicItem";
import type { StoredProduct } from "@/server/blog/types/StoredProduct";
import type { CalendarQueueSettings } from "@/features/workspace/types/CalendarQueueSettings";
import type { BlogPublishingIntegration } from "@/features/workspace/types/integrations/BlogPublishingIntegration";

export type LocalProduct = StoredProduct & {
  id: string;
  createdAt: number;
  updatedAt: number;
  scannedAt?: number;
  calendarQueueSettings: CalendarQueueSettings;
  blogPublishingIntegration?: BlogPublishingIntegration;
};

export type LocalState = {
  schemaVersion: 1;
  revision: number;
  activeProductId: string | null;
  products: LocalProduct[];
  topics: (TopicItem & { productId: string })[];
  blogs: (BlogItem & { topicId?: string })[];
  blogVersions: (ArticleVersionItem & { blogId: string })[];
};
