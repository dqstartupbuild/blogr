import { FileSearch, FileText, Pencil } from "lucide-react";
import { SecondaryButton } from "./SecondaryButton";

type TopicBriefButtonProps = {
  disabled: boolean;
  hasBrief: boolean;
  isLocked: boolean;
  onOpen: () => void;
};

export const TopicBriefButton = ({
  disabled,
  hasBrief,
  isLocked,
  onOpen,
}: TopicBriefButtonProps) => {
  return (
    <SecondaryButton disabled={disabled} onClick={onOpen} type="button">
      {isLocked ? (
        <FileText size={16} aria-hidden="true" />
      ) : hasBrief ? (
        <Pencil size={16} aria-hidden="true" />
      ) : (
        <FileSearch size={16} aria-hidden="true" />
      )}
      {isLocked ? "View brief" : hasBrief ? "Edit brief" : "Find brief"}
    </SecondaryButton>
  );
};
