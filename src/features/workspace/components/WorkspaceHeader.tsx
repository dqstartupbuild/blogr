import { PenLine } from "lucide-react";
import { AuthActions } from "@/features/auth/components/AuthActions";

export const WorkspaceHeader = () => {
  return (
    <header className="border-b border-black bg-white">
      <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-md border border-black bg-black text-white">
            <PenLine size={18} aria-hidden="true" />
          </span>
          <div>
            <p className="text-base font-semibold">Blogger</p>
            <p className="text-sm text-black">Long posts, clean exports.</p>
          </div>
        </div>
        <AuthActions />
      </div>
    </header>
  );
};
