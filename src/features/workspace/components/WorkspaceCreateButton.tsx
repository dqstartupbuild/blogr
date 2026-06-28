import { Plus } from "lucide-react";
import { SecondaryButton } from "./SecondaryButton";

type WorkspaceCreateButtonProps = {
  disabled: boolean;
  isCompact?: boolean;
  onClick: () => void;
};

export const WorkspaceCreateButton = ({
  disabled,
  isCompact = false,
  onClick,
}: WorkspaceCreateButtonProps) => {
  if (isCompact) {
    return (
      <button
        aria-label="New workspace"
        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-black/15 bg-white text-black transition hover:border-black hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
        disabled={disabled}
        onClick={onClick}
        type="button"
      >
        <Plus size={16} aria-hidden="true" />
      </button>
    );
  }

  return (
    <SecondaryButton disabled={disabled} onClick={onClick} type="button">
      <Plus size={16} aria-hidden="true" />
      New
    </SecondaryButton>
  );
};
