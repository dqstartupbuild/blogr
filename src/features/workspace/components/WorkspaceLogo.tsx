import { PenLine } from "lucide-react";

export const WorkspaceLogo = () => {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-md bg-black text-white">
        <PenLine size={19} aria-hidden="true" />
      </span>
      <span className="text-xl font-semibold text-black">Blogger</span>
    </div>
  );
};
