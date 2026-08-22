import type { LinkItem } from "../LinkItem";

export type TopicDiscoveryBrief = {
  intent: string;
  sections: string[];
  weakSpots: string[];
  sources: LinkItem[];
};
