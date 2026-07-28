import assert from "node:assert/strict";
import test from "node:test";
// @ts-expect-error -- Node runs this TypeScript test directly with type stripping.
import { mergeProductLinkStates } from "./mergeProductLinkStates.ts";

test("preserves paused links and enables newly discovered links", () => {
  const links = mergeProductLinkStates({
    currentLinks: [
      {
        isActive: false,
        title: "Old pricing title",
        url: "https://example.com/pricing",
      },
    ],
    refreshedLinks: [
      {
        isActive: true,
        title: "Current pricing title",
        url: "https://example.com/pricing",
      },
      {
        isActive: true,
        title: "Features",
        url: "https://example.com/features",
      },
    ],
  });

  assert.deepEqual(links, [
    {
      isActive: false,
      title: "Current pricing title",
      url: "https://example.com/pricing",
    },
    {
      isActive: true,
      title: "Features",
      url: "https://example.com/features",
    },
  ]);
});
