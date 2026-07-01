import { Eye } from "lucide-react";
import { SecondaryButton } from "./SecondaryButton";

type CalendarOpenArticleButtonProps = {
  blogId: string;
  onOpen: (blogId: string) => void;
};

export const CalendarOpenArticleButton = ({
  blogId,
  onOpen,
}: CalendarOpenArticleButtonProps) => {
  return (
    <SecondaryButton onClick={() => onOpen(blogId)} type="button">
      <Eye size={16} aria-hidden="true" />
      Open article
    </SecondaryButton>
  );
};
