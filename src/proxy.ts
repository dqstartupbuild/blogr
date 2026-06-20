import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const hasClerkKeys = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY,
);
const isProtectedApiRoute = createRouteMatcher(["/api(.*)"]);

const openProxy = () => NextResponse.next();

const proxy = hasClerkKeys
  ? clerkMiddleware(async (auth, request) => {
      if (process.env.AUTH_DISABLED_FOR_PREVIEW === "true") {
        return NextResponse.next();
      }

      if (isProtectedApiRoute(request)) {
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
