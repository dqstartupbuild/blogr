import { Sparkles } from "lucide-react";
import { SecondaryButton } from "./SecondaryButton";

type TopicWriteButtonProps = {
  disabled: boolean;
  onWrite: () => void;
};

export const TopicWriteButton = ({
  disabled,
  onWrite,
}: TopicWriteButtonProps) => {
  return (
    <SecondaryButton disabled={disabled} onClick={onWrite} type="button">
      <Sparkles size={16} aria-hidden="true" />
      Write blog
    </SecondaryButton>
  );
};
