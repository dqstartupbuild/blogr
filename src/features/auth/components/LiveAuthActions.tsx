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
        <button className="inline-flex h-9 items-center gap-2 rounded-md border border-[#cfc7b8] bg-white px-3 text-sm font-semibold text-[#26332d]">
          <LogIn size={15} aria-hidden="true" />
          Sign in
        </button>
      </SignInButton>
      <SignUpButton mode="modal">
        <button className="inline-flex h-9 items-center gap-2 rounded-md bg-[#1d2320] px-3 text-sm font-semibold text-white">
          <UserPlus size={15} aria-hidden="true" />
          Sign up
        </button>
      </SignUpButton>
    </div>
  );
};
