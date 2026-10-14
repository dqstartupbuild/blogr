import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { NextResponse } from "next/server";
import { assertLocalRequest } from "@/local/server/assertLocalRequest";
import { getLocalHome } from "@/local/server/getLocalHome";
import { localErrorResponse } from "@/local/server/localErrorResponse";
export const runtime = "nodejs";
export async function GET(request: Request, { params }: { params: Promise<{ fileId: string }> }) {
  try {
    assertLocalRequest(request);
    const { fileId } = await params;
    if (!/^[a-f0-9-]{36}\.(png|jpg|webp|gif)$/.test(fileId)) throw new Error("Image not found.");
    const bytes = await readFile(join(getLocalHome(), "media", fileId));
    const ext = fileId.split(".").pop();
    return new NextResponse(bytes, { headers: { "Content-Type": ext === "jpg" ? "image/jpeg" : `image/${ext}`, "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" } });
  } catch (error) { return localErrorResponse(error); }
}
