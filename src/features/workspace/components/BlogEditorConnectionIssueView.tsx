"use client";

export const BlogEditorConnectionIssueView = () => {
  return (
    <div className="min-h-screen bg-white text-black">
      <main className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <section className="rounded-lg border border-black bg-white p-6">
          <h1 className="text-xl font-semibold text-black">
            We could not open this blog
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-black">
            Try signing out and back in, then open the blog again.
          </p>
        </section>
      </main>
    </div>
  );
};
