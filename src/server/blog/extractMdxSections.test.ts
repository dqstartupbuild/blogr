import assert from "node:assert/strict";
import test from "node:test";
// @ts-expect-error -- Node runs this TypeScript test directly with type stripping.
import { extractMdxSections } from "./extractMdxSections.ts";

test("extracts ordered H2 sections with their complete bodies", () => {
  const sections = extractMdxSections(`# Article

Intro copy.

## First section

First body.

### Detail

Detail body.

## Second section

Second body.`);

  assert.deepEqual(sections, [
    {
      body: "First body.\n\n### Detail\n\nDetail body.",
      heading: "First section",
      index: 0,
    },
    {
      body: "Second body.",
      heading: "Second section",
      index: 1,
    },
  ]);
});
