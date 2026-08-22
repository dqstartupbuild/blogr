import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const hasClerkKeys = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY,
);
const isProtectedApiRoute = createRouteMatcher(["/api(.*)"]);
const isWorkerApiRoute = createRouteMatcher(["/api/worker(.*)"]);

const getWorkerOnlyResponse = (request: NextRequest) => {
  if (process.env.BLOG_AI_WORKER_ONLY !== "true" || isWorkerApiRoute(request)) {
    return null;
  }

  return new NextResponse(null, { status: 404 });
};

const openProxy = (request: NextRequest) =>
  getWorkerOnlyResponse(request) || NextResponse.next();

const proxy = hasClerkKeys
  ? clerkMiddleware(async (auth, request) => {
      const workerOnlyResponse = getWorkerOnlyResponse(request);

      if (workerOnlyResponse) {
        return workerOnlyResponse;
      }

      if (process.env.AUTH_DISABLED_FOR_PREVIEW === "true") {
        return NextResponse.next();
      }

      if (isProtectedApiRoute(request) && !isWorkerApiRoute(request)) {
        await auth.protect();
      }

      return NextResponse.next();
    })
  : openProxy;

export default proxy;

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/(.*)",
  ],
};
