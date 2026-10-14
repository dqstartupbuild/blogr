import { describe, expect, it } from "vitest";
import type { TopicItem } from "../types/TopicItem";
import { buildQuickFillAssignments } from "./buildQuickFillAssignments";

const topic = (
  id: string,
  status: TopicItem["status"],
  createdAt: number,
  scheduledDate?: string,
): TopicItem => ({ createdAt, id, keyword: id, scheduledDate, status });

describe("buildQuickFillAssignments", () => {
  it("pairs the oldest eligible topic with the earliest open date", () => {
    const assignments = buildQuickFillAssignments(
      [topic("new", "saved", 20), topic("old", "failed", 10)],
      ["2026-08-04", "2026-08-02"],
    );
    expect(assignments).toEqual([
      { scheduledDate: "2026-08-02", topicId: "old" },
      { scheduledDate: "2026-08-04", topicId: "new" },
    ]);
  });

  it("merges saved and failed topics and excludes ineligible or scheduled topics", () => {
    const assignments = buildQuickFillAssignments(
      [
        topic("written", "written", 1),
        topic("scheduled", "saved", 2, "2026-08-01"),
        topic("failed", "failed", 3),
        topic("saved", "saved", 4),
      ],
      ["2026-08-01", "2026-08-02", "2026-08-03"],
    );
    expect(assignments.map((item) => item.topicId)).toEqual(["failed", "saved"]);
    expect(assignments.map((item) => item.scheduledDate)).toEqual([
      "2026-08-02",
      "2026-08-03",
    ]);
  });

  it("uses topic ID as a stable createdAt tie breaker", () => {
    expect(
      buildQuickFillAssignments(
        [topic("b", "saved", 10), topic("a", "failed", 10)],
        ["2026-08-01", "2026-08-02"],
      ).map((item) => item.topicId),
    ).toEqual(["a", "b"]);
  });

  it("caps one invocation at 30 assignments", () => {
    const topics = Array.from({ length: 40 }, (_, index) =>
      topic(`topic-${String(index).padStart(2, "0")}`, "saved", index),
    );
    const dates = Array.from(
      { length: 40 },
      (_, index) => `2026-09-${String(index + 1).padStart(2, "0")}`,
    );
    expect(buildQuickFillAssignments(topics, dates)).toHaveLength(30);
  });
});
