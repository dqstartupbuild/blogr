import type { LinkItem } from "@/features/workspace/types/LinkItem";
import type { ResearchSource } from "./types/ResearchSource";

export const buildSourceLinks = (sources: ResearchSource[]): LinkItem[] => {
  return sources.slice(0, 6).map((source) => ({
    reason: source.description,
    title: source.title,
    url: source.url,
  }));
};
