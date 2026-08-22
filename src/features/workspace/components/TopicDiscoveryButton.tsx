import { Search } from "lucide-react";
import { SecondaryButton } from "./SecondaryButton";

type TopicDiscoveryButtonProps = {
  onOpen: () => void;
};

export const TopicDiscoveryButton = ({ onOpen }: TopicDiscoveryButtonProps) => {
  return (
    <SecondaryButton onClick={onOpen} type="button">
      <Search size={16} aria-hidden="true" />
      Find topic ideas
    </SecondaryButton>
  );
};
