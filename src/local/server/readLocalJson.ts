export const readLocalJson = async (request: Request, maxBytes = 1024 * 1024): Promise<Record<string, unknown>> => {
  if (Number(request.headers.get("content-length")) > maxBytes) throw new Error("This request is too large.");
  const reader = request.body?.getReader();
  if (!reader) throw new Error("This request has no data.");
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const part = await reader.read();
    if (part.done) break;
    size += part.value.byteLength;
    if (size > maxBytes) { await reader.cancel(); throw new Error("This request is too large."); }
    chunks.push(part.value);
  }
  const text = Buffer.concat(chunks.map((chunk) => Buffer.from(chunk)), size).toString("utf8");
  const data: unknown = JSON.parse(text);
  if (!data || typeof data !== "object" || Array.isArray(data)) throw new Error("Invalid request.");
  return data as Record<string, unknown>;
};
