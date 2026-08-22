import Link from "next/link";
import { Lightbulb } from "lucide-react";

export const DashboardTip = () => {
  return (
    <section className="flex flex-col gap-4 rounded-lg border border-black/10 bg-black/5 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-black text-white">
          <Lightbulb size={20} aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-semibold text-black">
            Save a topic, write an article, review it, then publish.
          </p>
          <p className="mt-1 text-sm leading-6 text-black/60">
            Start with a topic when you want a new post.
          </p>
        </div>
      </div>
      <Link
        className="inline-flex h-10 items-center justify-center rounded-md border border-black bg-white px-4 text-sm font-semibold text-black transition hover:bg-black hover:text-white"
        href="/topics"
      >
        Go to topics
      </Link>
    </section>
  );
};
