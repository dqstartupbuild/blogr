import { FileSearch } from "lucide-react";
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
      <FileSearch size={16} aria-hidden="true" />
      {hasBrief ? "View brief" : "Find brief"}
    </SecondaryButton>
  );
};
