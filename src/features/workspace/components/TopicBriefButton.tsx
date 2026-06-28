import { FileSearch, Pencil } from "lucide-react";
import { SecondaryButton } from "./SecondaryButton";

type TopicBriefButtonProps = {
  disabled: boolean;
  hasBrief: boolean;
  onOpen: () => void;
};

export const TopicBriefButton = ({
  disabled,
  hasBrief,
  onOpen,
}: TopicBriefButtonProps) => {
  return (
    <SecondaryButton disabled={disabled} onClick={onOpen} type="button">
      {hasBrief ? (
        <Pencil size={16} aria-hidden="true" />
      ) : (
        <FileSearch size={16} aria-hidden="true" />
      )}
      {hasBrief ? "Edit brief" : "Find brief"}
    </SecondaryButton>
  );
};
