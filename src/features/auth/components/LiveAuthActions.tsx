"use client";

import { SignInButton, SignUpButton, UserButton, useAuth } from "@clerk/nextjs";
import { LogIn, UserPlus } from "lucide-react";

export const LiveAuthActions = () => {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return null;
  }

  if (isSignedIn) {
    return <UserButton />;
  }

  return (
    <div className="flex items-center gap-2">
      <SignInButton mode="modal">
        <button className="inline-flex h-9 w-9 items-center justify-center gap-2 rounded-full border border-black/15 bg-white text-sm font-semibold text-black transition hover:border-black lg:w-auto lg:rounded-md lg:border-black lg:px-3">
          <LogIn size={15} aria-hidden="true" />
          <span className="sr-only lg:not-sr-only">Sign in</span>
        </button>
      </SignInButton>
      <SignUpButton mode="modal">
        <button className="inline-flex h-9 w-9 items-center justify-center gap-2 rounded-full bg-black text-sm font-semibold text-white lg:w-auto lg:rounded-md lg:px-3">
          <UserPlus size={15} aria-hidden="true" />
          <span className="sr-only lg:not-sr-only">Sign up</span>
        </button>
      </SignUpButton>
    </div>
  );
};
