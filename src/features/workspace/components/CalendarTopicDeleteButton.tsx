import { Trash2 } from "lucide-react";
import { CalendarTopicActionButton } from "./CalendarTopicActionButton";

type CalendarTopicDeleteButtonProps = {
  deleteTopic: () => Promise<void> | void;
};

export const CalendarTopicDeleteButton = ({
  deleteTopic,
}: CalendarTopicDeleteButtonProps) => {
  return (
    <CalendarTopicActionButton
      label="Delete topic"
      onClick={() => {
        if (
          window.confirm(
            "Delete this topic? Articles already created from it will stay in Articles.",
          )
        ) {
          void Promise.resolve(deleteTopic()).catch(() => undefined);
        }
      }}
    >
      <Trash2 size={15} aria-hidden="true" />
    </CalendarTopicActionButton>
  );
};
