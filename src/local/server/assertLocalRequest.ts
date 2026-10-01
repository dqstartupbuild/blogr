import { getRuntimeMode } from "./getRuntimeMode";

const loopback = new Set(["localhost", "127.0.0.1", "[::1]", "::1"]);
export const assertLocalRequest = (request: Request, maxBytes = 1024 * 1024) => {
  getRuntimeMode();
  const hostValue = request.headers.get("host");
  if (!hostValue) throw new Error("Local API requires a loopback host.");
  let host: URL;
  try { host = new URL(`http://${hostValue}`); }
  catch { throw new Error("Local API requires a loopback host."); }
  if (!loopback.has(host.hostname.toLowerCase()) || host.username || host.password || host.pathname !== "/") throw new Error("Local API requires a loopback host.");
  if (request.method !== "GET") {
    const originValue = request.headers.get("origin");
    let origin: URL;
    try { origin = new URL(originValue || ""); }
    catch { throw new Error("Open Blogger from this local server to save changes."); }
    if (origin.protocol !== "http:" || origin.host.toLowerCase() !== host.host.toLowerCase()) throw new Error("Open Blogger from this local server to save changes.");
    const length = Number(request.headers.get("content-length") || 0);
    if (!Number.isFinite(length) || length > maxBytes) throw new Error("This request is too large.");
  }
};
