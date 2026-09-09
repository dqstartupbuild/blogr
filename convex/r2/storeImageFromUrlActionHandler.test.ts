import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  buildR2ImageKey: vi.fn(),
  getR2ImageUrl: vi.fn(),
  requireUserId: vi.fn(),
  store: vi.fn(),
}));

vi.mock("../identity/requireUserId", () => ({ requireUserId: mocks.requireUserId }));
vi.mock("./buildR2ImageKey", () => ({ buildR2ImageKey: mocks.buildR2ImageKey }));
vi.mock("./client", () => ({ r2: { store: mocks.store } }));
vi.mock("./getR2ImageUrl", () => ({ getR2ImageUrl: mocks.getR2ImageUrl }));

import { storeImageFromUrlActionHandler } from "./storeImageFromUrlActionHandler";

const originalFetch = global.fetch;

beforeEach(() => {
  mocks.requireUserId.mockResolvedValue("user_123");
  mocks.buildR2ImageKey.mockReturnValue("user_123/blog-images/image.jpg");
  mocks.store.mockResolvedValue("user_123/blog-images/image.jpg");
  mocks.getR2ImageUrl.mockResolvedValue("https://images.example/image.jpg");
});

afterEach(() => {
  global.fetch = originalFetch;
  vi.clearAllMocks();
});

describe("storeImageFromUrlActionHandler", () => {
  it("stores JPEG bytes declared as PNG with the detected MIME type and extension", async () => {
    global.fetch = vi.fn().mockResolvedValue(
      new Response(new Uint8Array([0xff, 0xd8, 0xff, 0xe0]), {
        headers: { "content-type": "image/png" },
      }),
    );

    await expect(
      storeImageFromUrlActionHandler({} as never, {
        category: "blog-images",
        filenameHint: "image",
        url: "https://images.example/image.png",
      }),
    ).resolves.toEqual({
      key: "user_123/blog-images/image.jpg",
      url: "https://images.example/image.jpg",
    });

    expect(mocks.buildR2ImageKey).toHaveBeenCalledWith(
      expect.objectContaining({ extension: "jpg" }),
    );
    expect(mocks.store).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ type: "image/jpeg" }),
      expect.objectContaining({ type: "image/jpeg" }),
    );
  });

  it("rejects unsupported bytes before writing to R2", async () => {
    global.fetch = vi.fn().mockResolvedValue(new Response("<svg></svg>"));

    await expect(
      storeImageFromUrlActionHandler({} as never, {
        category: "blog-images",
        url: "https://images.example/image.svg",
      }),
    ).rejects.toThrow("Downloaded file is not an image.");

    expect(mocks.store).not.toHaveBeenCalled();
  });
});
