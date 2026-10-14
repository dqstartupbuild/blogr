import Replicate from "replicate";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { createReplicateClientMock } = vi.hoisted(() => ({
  createReplicateClientMock: vi.fn(),
}));

vi.mock("./createReplicateClient", () => ({
  createReplicateClient: createReplicateClientMock,
}));

import { runReplicateImage } from "./runReplicateImage";

describe("runReplicateImage", () => {
  beforeEach(() => {
    createReplicateClientMock.mockReset();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("polls a processing prediction until the SDK returns a FileOutput URL", async () => {
    vi.stubEnv("REPLICATE_IMAGE_MODEL", "");
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(null, { headers: { "Retry-After": "0" }, status: 429 }),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            id: "prediction-1",
            output: null,
            status: "processing",
          }),
          { headers: { "Content-Type": "application/json" } },
        ),
      )
      .mockResolvedValueOnce(
        new Response(null, { headers: { "Retry-After": "0" }, status: 429 }),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            id: "prediction-1",
            output: ["https://replicate.delivery/image.png"],
            status: "succeeded",
          }),
          { headers: { "Content-Type": "application/json" } },
        ),
      )
      .mockResolvedValueOnce(
        new Response(new Uint8Array([137, 80, 78, 71]), {
          headers: { "Content-Type": "image/png" },
        }),
      );
    const client = new Replicate({ auth: "test-token", fetch: fetchMock });
    createReplicateClientMock.mockReturnValue(client);

    await expect(runReplicateImage("A test image")).resolves.toBe(
      "https://replicate.delivery/image.png",
    );
    expect(fetchMock).toHaveBeenCalledTimes(5);
    expect(new URL(fetchMock.mock.calls[0][0].toString()).pathname).toBe(
      "/v1/models/google/nano-banana-2/predictions",
    );
    expect(new URL(fetchMock.mock.calls[1][0].toString()).pathname).toBe(
      "/v1/models/google/nano-banana-2/predictions",
    );
    expect(new URL(fetchMock.mock.calls[2][0].toString()).pathname).toBe(
      "/v1/predictions/prediction-1",
    );
    expect(new URL(fetchMock.mock.calls[3][0].toString()).pathname).toBe(
      "/v1/predictions/prediction-1",
    );
    expect(
      fetchMock.mock.calls.filter(
        ([request]) =>
          new URL(request.toString()).pathname ===
          "/v1/models/google/nano-banana-2/predictions",
      ),
    ).toHaveLength(2);
  });

  it("uses the configured image model", async () => {
    vi.stubEnv("REPLICATE_IMAGE_MODEL", "owner/custom-image-model");
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            id: "prediction-override",
            output: "https://replicate.delivery/custom-image.png",
            status: "succeeded",
          }),
          { headers: { "Content-Type": "application/json" } },
        ),
      )
      .mockResolvedValueOnce(
        new Response(new Uint8Array([137, 80, 78, 71]), {
          headers: { "Content-Type": "image/png" },
        }),
      );
    createReplicateClientMock.mockReturnValue(
      new Replicate({ auth: "test-token", fetch: fetchMock }),
    );

    await expect(runReplicateImage("An overridden image")).resolves.toBe(
      "https://replicate.delivery/custom-image.png",
    );
    expect(new URL(fetchMock.mock.calls[0][0].toString()).pathname).toBe(
      "/v1/models/owner/custom-image-model/predictions",
    );
  });

  it("rejects failed predictions and returns empty output unchanged", async () => {
    const failedClient = new Replicate({
      auth: "test-token",
      fetch: vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            error: "model error",
            id: "prediction-2",
            output: null,
            status: "failed",
          }),
          { headers: { "Content-Type": "application/json" } },
        ),
      ),
    });
    createReplicateClientMock.mockReturnValue(failedClient);

    await expect(runReplicateImage("A failed image")).rejects.toThrow(
      "Prediction failed: model error",
    );

    const emptyClient = new Replicate({
      auth: "test-token",
      fetch: vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            id: "prediction-3",
            output: null,
            status: "succeeded",
          }),
          { headers: { "Content-Type": "application/json" } },
        ),
      ),
    });
    createReplicateClientMock.mockReturnValue(emptyClient);

    await expect(runReplicateImage("An empty image")).resolves.toBe("");
  });
});
