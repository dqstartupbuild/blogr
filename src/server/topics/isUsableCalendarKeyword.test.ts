import assert from "node:assert/strict";
import test from "node:test";
// @ts-expect-error -- Node runs this TypeScript test directly with type stripping.
import { isUsableCalendarKeyword } from "./isUsableCalendarKeyword.ts";

test("rejects the old calendar template phrases", () => {
  assert.equal(
    isUsableCalendarKeyword(
      "locked goal savings setup launch checklist steps for people",
    ),
    false,
  );
  assert.equal(
    isUsableCalendarKeyword(
      "locked goal savings workflow mistakes warning signs for beginners",
    ),
    false,
  );
  assert.equal(
    isUsableCalendarKeyword(
      "locked goal savings weekly review template questions for people",
    ),
    false,
  );
});

test("accepts concise short and long-tail keyword candidates", () => {
  assert.equal(isUsableCalendarKeyword("locked savings account"), true);
  assert.equal(
    isUsableCalendarKeyword("how to stop dipping into savings"),
    true,
  );
});

test("rejects keyword candidates that are too long", () => {
  assert.equal(
    isUsableCalendarKeyword(
      "how to stop touching all of the money in a savings account every single month",
    ),
    false,
  );
});
