export type RasterImageFormat = {
  contentType: "image/gif" | "image/jpeg" | "image/png" | "image/webp";
  extension: "gif" | "jpg" | "png" | "webp";
};

const jpegSignature = [0xff, 0xd8, 0xff];
const pngSignature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
const gif87aSignature = [0x47, 0x49, 0x46, 0x38, 0x37, 0x61];
const gif89aSignature = [0x47, 0x49, 0x46, 0x38, 0x39, 0x61];
const riffSignature = [0x52, 0x49, 0x46, 0x46];
const webpSignature = [0x57, 0x45, 0x42, 0x50];

export const detectRasterImageFormat = (
  body: ArrayBuffer | Uint8Array,
): RasterImageFormat | null => {
  const bytes = body instanceof Uint8Array ? body : new Uint8Array(body);

  if (hasRasterImageSignature(bytes, jpegSignature)) {
    return { contentType: "image/jpeg", extension: "jpg" };
  }

  if (hasRasterImageSignature(bytes, pngSignature)) {
    return { contentType: "image/png", extension: "png" };
  }

  if (
    hasRasterImageSignature(bytes, gif87aSignature) ||
    hasRasterImageSignature(bytes, gif89aSignature)
  ) {
    return { contentType: "image/gif", extension: "gif" };
  }

  if (
    hasRasterImageSignature(bytes, riffSignature) &&
    hasRasterImageSignature(bytes, webpSignature, 8)
  ) {
    return { contentType: "image/webp", extension: "webp" };
  }

  return null;
};
import { hasRasterImageSignature } from "./hasRasterImageSignature";
