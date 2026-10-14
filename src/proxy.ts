import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
export default function proxy(request: NextRequest) {
  const host = request.nextUrl.hostname.toLowerCase();
  if (!["localhost", "127.0.0.1", "::1", "[::1]"].includes(host)) return new NextResponse("Open Blogger on this computer.", { status: 403 });
  return NextResponse.next();
}
export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"] };
