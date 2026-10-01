import { request as httpRequest } from "node:http";
import { request as httpsRequest } from "node:https";
import type { IncomingMessage } from "node:http";
import { detectRasterImageFormat } from "../../../shared/raster/detectRasterImageFormat";
import { assertPublicImageUrl } from "./assertPublicImageUrl";

const requestPinned = async (url: URL, address: string, family: number): Promise<IncomingMessage> => {
  return new Promise((resolve, reject) => {
    const request = (url.protocol === "https:" ? httpsRequest : httpRequest)(url, {
      method: "GET",
      lookup: (_hostname, _options, callback) => callback(null, address, family),
    }, resolve);
    request.setTimeout(30000, () => request.destroy(new Error("Image request timed out.")));
    request.on("error", reject);
    request.end();
  });
};
export const fetchPublicImage = async (value: string) => {
  let url = value;
  for (let redirect = 0; redirect < 4; redirect++) {
    const checked = await assertPublicImageUrl(url);
    const response = await requestPinned(checked.url, checked.address, checked.family);
    const status = response.statusCode || 0;
    if (status >= 300 && status < 400) { const location = response.headers.location; response.resume(); if (!location) throw new Error("Image redirect is invalid."); url = new URL(location, checked.url).href; continue; }
    if (status < 200 || status >= 300) { response.resume(); throw new Error("Could not download this image."); }
    const length = Number(response.headers["content-length"] || 0);
    if (length > 20 * 1024 * 1024) { response.destroy(); throw new Error("Image is larger than 20 MB."); }
    const chunks: Uint8Array[] = []; let size = 0;
    for await (const chunk of response) { size += chunk.length; if (size > 20 * 1024 * 1024) { response.destroy(); throw new Error("Image is larger than 20 MB."); } chunks.push(chunk); }
    const bytes = Buffer.concat(chunks);
    const format = detectRasterImageFormat(bytes);
    if (!format) throw new Error("Image format is not supported.");
    return { bytes, contentType: format.contentType };
  }
  throw new Error("Image redirected too many times.");
};
