import { describe, expect, it } from "vitest";

import { detectRasterImageFormat } from "./detectRasterImageFormat";

describe("detectRasterImageFormat", () => {
  it("recognizes supported raster bytes", () => {
    const formats = [
      [[0xff, 0xd8, 0xff, 0xe0], { contentType: "image/jpeg", extension: "jpg" }],
      [
        [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a],
        { contentType: "image/png", extension: "png" },
      ],
      [[0x47, 0x49, 0x46, 0x38, 0x37, 0x61], { contentType: "image/gif", extension: "gif" }],
      [[0x47, 0x49, 0x46, 0x38, 0x39, 0x61], { contentType: "image/gif", extension: "gif" }],
      [
        [0x52, 0x49, 0x46, 0x46, 0x24, 0x00, 0x00, 0x00, 0x57, 0x45, 0x42, 0x50],
        { contentType: "image/webp", extension: "webp" },
      ],
    ] as const;

    for (const [bytes, expected] of formats) {
      expect(detectRasterImageFormat(new Uint8Array(bytes))).toEqual(expected);
    }
  });

  it("rejects malformed, truncated, and non-raster bytes", () => {
    const invalidBodies = [
      [],
      [0xff, 0xd8],
      [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a],
      [0x47, 0x49, 0x46, 0x38, 0x39],
      [0x52, 0x49, 0x46, 0x46, 0x24, 0x00, 0x00, 0x00, 0x57, 0x45, 0x42],
      [0x3c, 0x73, 0x76, 0x67, 0x3e],
    ];

    for (const bytes of invalidBodies) {
      expect(detectRasterImageFormat(new Uint8Array(bytes))).toBeNull();
    }
  });
});
