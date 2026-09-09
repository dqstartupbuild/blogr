import { afterEach, describe, expect, it, vi } from "vitest";

import { downloadImageUrl } from "./downloadImageUrl";

const originalFetch = global.fetch;

afterEach(() => {
  global.fetch = originalFetch;
});

describe("downloadImageUrl", () => {
  it("normalizes JPEG bytes declared as PNG to image/jpeg", async () => {
    global.fetch = vi.fn().mockResolvedValue(
      new Response(new Uint8Array([0xff, 0xd8, 0xff, 0xe0]), {
        headers: { "content-type": "image/png" },
      }),
    );

    await expect(downloadImageUrl("https://images.example/image.png")).resolves.toMatchObject({
      contentType: "image/jpeg",
    });
  });

  it("rejects unsupported image bytes even when the header is image/png", async () => {
    global.fetch = vi.fn().mockResolvedValue(
      new Response("<svg></svg>", {
        headers: { "content-type": "image/png" },
      }),
    );

    await expect(downloadImageUrl("https://images.example/image.png")).resolves.toBeNull();
  });
});
