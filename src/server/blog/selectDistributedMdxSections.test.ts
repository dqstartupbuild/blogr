import assert from "node:assert/strict";
import test from "node:test";
// @ts-expect-error -- Node runs this TypeScript test directly with type stripping.
import { selectDistributedMdxSections } from "./selectDistributedMdxSections.ts";

test("selects section-zone midpoints across the article", () => {
  const sections = Array.from({ length: 9 }, (_, index) => ({
    body: `Body ${index + 1}`,
    heading: `Section ${index + 1}`,
    index,
  }));

  assert.deepEqual(
    selectDistributedMdxSections(sections, 3).map((section) => section.index),
    [1, 4, 7],
  );
});

test("does not select the same section twice in a short article", () => {
  const sections = Array.from({ length: 2 }, (_, index) => ({
    body: `Body ${index + 1}`,
    heading: `Section ${index + 1}`,
    index,
  }));

  assert.deepEqual(
    selectDistributedMdxSections(sections, 4).map((section) => section.index),
    [0, 1],
  );
});

test("keeps stable indexes when section headings are duplicated", () => {
  const sections = Array.from({ length: 6 }, (_, index) => ({
    body: `Body ${index + 1}`,
    heading: index === 1 || index === 4 ? "Repeated heading" : `Section ${index + 1}`,
    index,
  }));

  assert.deepEqual(
    selectDistributedMdxSections(sections, 2).map((section) => ({
      heading: section.heading,
      index: section.index,
    })),
    [
      { heading: "Repeated heading", index: 1 },
      { heading: "Repeated heading", index: 4 },
    ],
  );
});
