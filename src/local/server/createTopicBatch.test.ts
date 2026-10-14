import { describe, expect, it } from "vitest";
import { emptyLocalState } from "../domain/emptyLocalState";
import { createTopicBatch } from "./actions/createTopicBatch";
import { mutateLocalState } from "./mutateLocalState";

describe("createTopicBatch", () => {
  it("saves unscheduled ideas and skips ones the workspace already has", () => {
    const state = emptyLocalState();
    const productId = mutateLocalState(state, "createProductWorkspaceMutation", { name: "Alpha" }) as string;
    mutateLocalState(state, "createTopicMutation", { productId, keyword: "Existing idea" });

    const result = createTopicBatch(state, {
      productId,
      topics: [
        { keyword: "existing idea" },
        { keyword: "Fresh idea", notes: "Brief" },
        { keyword: "Fresh idea" },
        { keyword: "  " },
      ],
    });

    expect(result).toEqual({ createdCount: 1, skippedCount: 3 });
    const added = state.topics.find((topic) => topic.keyword === "Fresh idea");
    expect(added).toMatchObject({ status: "saved", notes: "Brief", productId });
    expect(added?.scheduledDate).toBeUndefined();
  });

  it("caps a batch at 30 topics", () => {
    const state = emptyLocalState();
    const productId = mutateLocalState(state, "createProductWorkspaceMutation", { name: "Beta" }) as string;
    const topics = Array.from({ length: 40 }, (_, index) => ({ keyword: `Idea number ${index} about ${"abcdefghijklmnopqrstuvwxyzabcdefghijklmn"[index]}` }));

    expect(createTopicBatch(state, { productId, topics }).createdCount).toBeLessThanOrEqual(30);
  });
});
