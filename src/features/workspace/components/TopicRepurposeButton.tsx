import { ClipboardPen } from "lucide-react";
import { SecondaryButton } from "./SecondaryButton";

type TopicRepurposeButtonProps = {
  disabled: boolean;
  onOpen: () => void;
};

export const TopicRepurposeButton = ({
  disabled,
  onOpen,
}: TopicRepurposeButtonProps) => {
  return (
    <SecondaryButton disabled={disabled} onClick={onOpen} type="button">
      <ClipboardPen size={16} aria-hidden="true" />
      Repurpose
    </SecondaryButton>
  );
};
