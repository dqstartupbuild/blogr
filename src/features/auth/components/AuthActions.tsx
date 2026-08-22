"use client";

import { LiveAuthActions } from "./LiveAuthActions";

export const AuthActions = () => {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return null;
  }

  return <LiveAuthActions />;
};
