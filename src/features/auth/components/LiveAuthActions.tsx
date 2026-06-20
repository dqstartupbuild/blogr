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
        <button className="inline-flex h-9 items-center gap-2 rounded-md border border-black bg-white px-3 text-sm font-semibold text-black">
          <LogIn size={15} aria-hidden="true" />
          Sign in
        </button>
      </SignInButton>
      <SignUpButton mode="modal">
        <button className="inline-flex h-9 items-center gap-2 rounded-md bg-black px-3 text-sm font-semibold text-white">
          <UserPlus size={15} aria-hidden="true" />
          Sign up
        </button>
      </SignUpButton>
    </div>
  );
};
