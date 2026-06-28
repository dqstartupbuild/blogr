import { PenLine } from "lucide-react";

export const WorkspaceLogo = () => {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-9 w-9 items-center justify-center rounded-md bg-black text-white lg:h-10 lg:w-10">
        <PenLine size={19} aria-hidden="true" />
      </span>
      <span className="text-lg font-semibold text-black lg:text-xl">Blogr</span>
    </div>
  );
};
