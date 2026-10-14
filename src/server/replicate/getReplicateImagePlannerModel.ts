import type { ReplicateModelSlug } from "./types/ReplicateModelSlug";

export const getReplicateImagePlannerModel = () => {
  return (process.env.REPLICATE_IMAGE_PLANNER_MODEL ||
    "openai/gpt-5-mini") as ReplicateModelSlug;
};
