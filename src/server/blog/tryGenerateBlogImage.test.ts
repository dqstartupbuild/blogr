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
  });

  it("contains an image failure and logs only generic diagnostics", async () => {
    runReplicateImageMock.mockRejectedValue(
      new TypeError("prompt and request details must stay private"),
    );
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);

    await expect(
      tryGenerateBlogImage({
        alt: "Test image",
        prompt: "private prompt",
        sectionHeading: "Introduction",
      }),
    ).resolves.toBeNull();
    expect(warn).toHaveBeenCalledWith("Blog image generation failed.", "TypeError");
    expect(warn.mock.calls.flat().join(" ")).not.toContain("private prompt");
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
    );
    expect(warn.mock.calls.flat().join(" ")).not.toContain("private prompt");
  });
});
