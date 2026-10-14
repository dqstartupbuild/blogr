import { describe, expect, it } from "vitest";
import { assertLocalRequest } from "./assertLocalRequest";
const request = (host: string, origin: string) => new Request("http://localhost:3000/api/local/mutation", { method: "POST", headers: { host, origin, "content-type": "application/json" }, body: "{}" });
describe("local API origin boundary", () => {
  it("accepts the browser Host even when Next normalizes request URL", () => {
    expect(() => assertLocalRequest(request("127.0.0.1:3000", "http://127.0.0.1:3000"))).not.toThrow();
    expect(() => assertLocalRequest(request("[::1]:3000", "http://[::1]:3000"))).not.toThrow();
  });
  it("rejects mismatched, remote, and missing origins", () => {
    expect(() => assertLocalRequest(request("127.0.0.1:3000", "http://localhost:3000"))).toThrow();
    expect(() => assertLocalRequest(request("evil.example:3000", "http://evil.example:3000"))).toThrow();
    expect(() => assertLocalRequest(request("127.0.0.1:3000", "https://127.0.0.1:3000"))).toThrow();
    expect(() => assertLocalRequest(request("127.0.0.1:3000", ""))).toThrow();
  });
});
