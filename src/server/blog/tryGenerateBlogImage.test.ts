import { afterEach, describe, expect, it, vi } from "vitest";

const { runReplicateImageMock } = vi.hoisted(() => ({
  runReplicateImageMock: vi.fn(),
}));

vi.mock("../replicate/runReplicateImage", () => ({
  runReplicateImage: runReplicateImageMock,
}));

import { tryGenerateBlogImage } from "./tryGenerateBlogImage";

describe("tryGenerateBlogImage", () => {
  afterEach(() => {
    runReplicateImageMock.mockReset();
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it("contains an image failure and logs safe provider diagnostics", async () => {
    vi.stubEnv("REPLICATE_IMAGE_MODEL", "google/configured-image-model");
    runReplicateImageMock.mockRejectedValue({
      cause: { code: "ECONNRESET" },
      message: "private prompt and request details must stay private",
      name: "ApiError",
      request: { headers: { authorization: "Bearer private-token" } },
      response: { body: "private provider response", status: 429 },
    });
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);

    await expect(
      tryGenerateBlogImage({
        alt: "Test image",
        prompt: "private prompt",
        sectionHeading: "Introduction",
      }),
    ).resolves.toBeNull();
    expect(warn).toHaveBeenCalledWith("Blog image generation failed.", {
      errorName: "ApiError",
      httpStatus: 429,
      model: "google/configured-image-model",
      networkCode: "ECONNRESET",
      stage: "prediction",
    });
    expect(warn.mock.calls.flat().join(" ")).not.toContain("private");
  });

  it("skips missing image output with a generic warning", async () => {
    runReplicateImageMock.mockResolvedValue("");
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);

    await expect(
      tryGenerateBlogImage({
        alt: "Test image",
        prompt: "private prompt",
        sectionHeading: "Introduction",
      }),
    ).resolves.toBeNull();
    expect(warn).toHaveBeenCalledWith(
      "Blog image generation returned no image URL.",
      {
        errorName: "UnknownError",
        model: "google/nano-banana-2",
        stage: "missing-output",
      },
    );
    expect(warn.mock.calls.flat().join(" ")).not.toContain("private prompt");
  });
});
