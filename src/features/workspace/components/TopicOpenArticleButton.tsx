import { Eye } from "lucide-react";
import { SecondaryButton } from "./SecondaryButton";

type TopicOpenArticleButtonProps = {
  blogId: string;
  onOpen: (blogId: string) => void;
};

export const TopicOpenArticleButton = ({
  blogId,
  onOpen,
}: TopicOpenArticleButtonProps) => {
  return (
    <SecondaryButton onClick={() => onOpen(blogId)} type="button">
      <Eye size={16} aria-hidden="true" />
      Open article
    </SecondaryButton>
  );
};
