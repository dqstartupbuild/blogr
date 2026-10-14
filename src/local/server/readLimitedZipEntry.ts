import type JSZip from "jszip";

export const readLimitedZipEntry = (entry: JSZip.JSZipObject, maxBytes: number): Promise<Buffer> => new Promise((resolve, reject) => {
  const chunks: Buffer[] = [];
  let size = 0;
  let done = false;
  const stream = entry.nodeStream();
  stream.on("data", (chunk: Buffer | Uint8Array) => {
    if (done) return;
    const value = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    size += value.length;
    if (size > maxBytes) {
      done = true;
      stream.pause();
      reject(new Error("Backup contains a file larger than the allowed limit."));
      return;
    }
    chunks.push(value);
  });
  stream.on("error", (error) => { if (!done) { done = true; reject(error); } });
  stream.on("end", () => { if (!done) { done = true; resolve(Buffer.concat(chunks, size)); } });
});
