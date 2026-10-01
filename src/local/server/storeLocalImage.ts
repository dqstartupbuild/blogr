import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fetchPublicImage } from "./fetchPublicImage";
import { getLocalHome } from "./getLocalHome";
import { trackManagedMedia } from "./trackManagedMedia";
export const storeLocalImage = async (url: string): Promise<string> => {
  const { bytes, contentType } = await fetchPublicImage(url);
  const ext = contentType === "image/png" ? "png" : contentType === "image/webp" ? "webp" : contentType === "image/gif" ? "gif" : "jpg";
  const name = `${randomUUID()}.${ext}`;
  const directory = join(getLocalHome(), "media");
  await mkdir(directory, { recursive: true, mode: 0o700 });
  await writeFile(join(directory, name), bytes, { flag: "wx", mode: 0o600 });
  trackManagedMedia(name);
  return `/api/local/media/${name}`;
};
