import { RefreshCw } from "lucide-react";
import { SecondaryButton } from "./SecondaryButton";

type BlogRefreshButtonProps = {
  onOpen: () => void;
};

export const BlogRefreshButton = ({ onOpen }: BlogRefreshButtonProps) => {
  return (
    <SecondaryButton onClick={onOpen} type="button">
      <RefreshCw size={16} aria-hidden="true" />
      Find refresh ideas
    </SecondaryButton>
  );
};
