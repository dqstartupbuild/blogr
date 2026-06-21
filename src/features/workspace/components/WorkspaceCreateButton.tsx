import { Plus } from "lucide-react";
import { SecondaryButton } from "./SecondaryButton";

type WorkspaceCreateButtonProps = {
  disabled: boolean;
  onClick: () => void;
};

export const WorkspaceCreateButton = ({
  disabled,
  onClick,
}: WorkspaceCreateButtonProps) => {
  return (
    <SecondaryButton disabled={disabled} onClick={onClick} type="button">
      <Plus size={16} aria-hidden="true" />
      New
    </SecondaryButton>
  );
};
