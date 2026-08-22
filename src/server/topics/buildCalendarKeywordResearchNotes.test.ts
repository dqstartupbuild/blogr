import assert from "node:assert/strict";
import test from "node:test";
// @ts-expect-error -- Node runs this TypeScript test directly with type stripping.
import { buildCalendarKeywordResearchNotes } from "./buildCalendarKeywordResearchNotes.ts";

test("turns exact-keyword SERP signals into a writing brief", () => {
  const notes = buildCalendarKeywordResearchNotes({
    candidate: {
      canonicalKeyword: "how to stop dipping into savings",
      intent: "Keep saved money set aside for a goal.",
      intentKey: "dipping-saving-stop",
      keyword: "how to stop dipping into savings",
      notes: "",
      sourceSignals: [],
      sourceType: "discovery",
    },
    signal: {
      aiAnswers: [],
      organicResults: [
        {
          description: "Practical ways to protect savings.",
          title: "Stop Spending Your Savings",
          url: "https://example.com/savings",
        },
      ],
      peopleAlsoAsk: ["How do I stop myself from using my savings?"],
      query: "how to stop dipping into savings",
      relatedSearches: ["savings account you cannot touch"],
    },
  });

  assert.match(notes, /Questions people also ask:/);
  assert.match(notes, /savings account you cannot touch/);
  assert.match(notes, /https:\/\/example.com\/savings/);
  assert.doesNotMatch(notes, /search volume/i);
});
