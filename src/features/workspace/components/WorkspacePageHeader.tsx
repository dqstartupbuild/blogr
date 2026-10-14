import type { ReactNode } from "react";

type WorkspacePageHeaderProps = {
  action?: ReactNode;
  description: string;
  title: string;
};

export const WorkspacePageHeader = ({
  action,
  description,
  title,
}: WorkspacePageHeaderProps) => {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-3xl font-semibold text-black">{title}</h1>
        <p className="mt-2 text-base leading-7 text-black/65">{description}</p>
      </div>
      {action ? <div className="flex shrink-0 flex-wrap gap-2">{action}</div> : null}
    </header>
  );
};
