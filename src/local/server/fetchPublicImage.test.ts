import { createServer } from "node:http";
import type { AddressInfo } from "node:net";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

const pinned = vi.hoisted(() => ({ port: 0 }));
vi.mock("./assertPublicImageUrl", () => ({
  assertPublicImageUrl: async (value: string) => ({ url: new URL(value.replace("PORT", String(pinned.port))), address: "127.0.0.1", family: 4 }),
}));
const { fetchPublicImage } = await import("./fetchPublicImage");

const png = Buffer.from("89504e470d0a1a0a0000000d4948445200000001000000010806000000", "hex");
const server = createServer((_request, response) => { response.writeHead(200, { "content-type": "image/png" }); response.end(png); });

describe("pinned public image download", () => {
  beforeAll(async () => { await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve)); pinned.port = (server.address() as AddressInfo).port; });
  afterAll(async () => { await new Promise((resolve) => server.close(resolve)); });
  it("connects to the validated address under Node's default family selection", async () => {
    const result = await fetchPublicImage("http://unresolvable-image-host.test:PORT/image.png");
    expect(result.contentType).toBe("image/png");
    expect(result.bytes.equals(png)).toBe(true);
  });
});
