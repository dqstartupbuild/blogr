import assert from "node:assert/strict";
import test from "node:test";
// @ts-expect-error -- Node runs this TypeScript test directly with type stripping.
import { getBlogFeatureImage } from "./getBlogFeatureImage.ts";

test("finds the feature image when section-assigned images are present", () => {
  const featureImage = {
    alt: "Feature",
    prompt: "Feature prompt",
    sectionHeading: "Article title",
    url: "https://example.com/feature.png",
  };

  assert.equal(
    getBlogFeatureImage([
      featureImage,
      {
        alt: "Supporting",
        prompt: "Supporting prompt",
        sectionHeading: "Middle section",
        sectionIndex: 4,
        url: "https://example.com/supporting.png",
      },
    ]),
    featureImage,
  );
});

test("does not promote a supporting image when feature generation failed", () => {
  assert.equal(
    getBlogFeatureImage([
      {
        alt: "Supporting",
        prompt: "Supporting prompt",
        sectionHeading: "Middle section",
        sectionIndex: 4,
        url: "https://example.com/supporting.png",
      },
    ]),
    undefined,
  );
});

test("keeps first-image compatibility for older saved articles", () => {
  const legacyFeatureImage = {
    alt: "Legacy feature",
    prompt: "Legacy prompt",
    sectionHeading: "Article title",
    url: "https://example.com/legacy.png",
  };

  assert.equal(getBlogFeatureImage([legacyFeatureImage]), legacyFeatureImage);
});
