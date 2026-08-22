import assert from "node:assert/strict";
import test from "node:test";
// @ts-expect-error -- Node runs this TypeScript test directly with type stripping.
import { mergeBlogImagePromptPlans } from "./mergeBlogImagePromptPlans.ts";

test("keeps deterministic placements while using AI-written image details", () => {
  const merged = mergeBlogImagePromptPlans({
    assignments: [
      {
        alt: "Fallback feature alt",
        prompt: "Fallback feature prompt",
        sectionHeading: "Article title",
      },
      {
        alt: "Fallback section alt",
        prompt: "Fallback section prompt",
        sectionHeading: "Assigned late section",
        sectionIndex: 7,
      },
    ],
    plans: [
      {
        alt: "AI feature alt",
        prompt: "AI feature prompt",
        sectionHeading: "Wrong introduction",
        sectionIndex: 0,
      },
      {
        alt: "AI section alt",
        prompt: "AI section prompt",
        sectionHeading: "Wrong early section",
        sectionIndex: 1,
      },
    ],
  });

  assert.deepEqual(merged, [
    {
      alt: "AI feature alt",
      prompt: "AI feature prompt",
      sectionHeading: "Article title",
      sectionIndex: undefined,
    },
    {
      alt: "AI section alt",
      prompt: "AI section prompt",
      sectionHeading: "Assigned late section",
      sectionIndex: 7,
    },
  ]);
});
