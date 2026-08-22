"use client";

import { AuthActions } from "@/features/auth/components/AuthActions";

export const SignedOutBlogEditorView = () => {
  return (
    <div className="min-h-screen bg-white text-black">
      <main className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <section className="rounded-lg border border-black bg-white p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-xl font-semibold text-black">
                Sign in to edit this blog
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-black">
                Your saved posts are waiting in your workspace.
              </p>
            </div>
            <AuthActions />
          </div>
        </section>
      </main>
    </div>
  );
};
