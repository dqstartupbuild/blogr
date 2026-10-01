import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

const isPrivateAddress = (address: string) => {
  const value = address.toLowerCase();
  if (value.includes(":")) return value === "::" || value === "::1" || value.startsWith("fc") || value.startsWith("fd") || value.startsWith("fe8") || value.startsWith("fe9") || value.startsWith("fea") || value.startsWith("feb") || value.startsWith("ff") || value.startsWith("::ffff:");
  const parts = value.split(".").map(Number);
  if (parts.length !== 4 || parts.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) return true;
  const [a,b] = parts;
  return a === 0 || a === 10 || a === 127 || a >= 224 || (a === 100 && b >= 64 && b <= 127) || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && (b === 168 || b === 0 || b === 2)) || (a === 198 && (b === 18 || b === 19)) || (a === 203 && b === 0) || (a === 198 && b === 51);
};
export const assertPublicImageUrl = async (value: string) => {
  const url = new URL(value);
  if (!["https:", "http:"].includes(url.protocol) || url.username || url.password || (url.port && !["80", "443"].includes(url.port))) throw new Error("Image URL is not allowed.");
  const host = url.hostname.toLowerCase();
  if (host === "localhost" || host.endsWith(".localhost") || host.endsWith(".local") || host.endsWith(".internal")) throw new Error("Image URL is not allowed.");
  const addresses = isIP(host) ? [{ address: host, family: isIP(host) }] : await lookup(host, { all: true });
  if (!addresses.length || addresses.some((entry) => isPrivateAddress(entry.address))) throw new Error("Image URL is not allowed.");
  return { url, address: addresses[0].address, family: addresses[0].family };
};
