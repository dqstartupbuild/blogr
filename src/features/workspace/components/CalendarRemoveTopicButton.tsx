"use client";

import { useState } from "react";
import { Link2Off } from "lucide-react";
import { SecondaryButton } from "./SecondaryButton";
import type { RemoveTopicFromCalendar } from "../types/RemoveTopicFromCalendar";

type CalendarRemoveTopicButtonProps = {
  onRemoved: () => void;
  removeTopicFromCalendar: RemoveTopicFromCalendar;
  topicId: string;
};

export const CalendarRemoveTopicButton = ({
  onRemoved,
  removeTopicFromCalendar,
  topicId,
}: CalendarRemoveTopicButtonProps) => {
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = async () => {
    setIsRemoving(true);

    try {
      await removeTopicFromCalendar(topicId);
      onRemoved();
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : "Could not remove this from the calendar yet.",
      );
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <SecondaryButton
      disabled={isRemoving}
      onClick={handleRemove}
      type="button"
    >
      <Link2Off size={16} aria-hidden="true" />
      {isRemoving ? "Removing..." : "Remove from calendar"}
    </SecondaryButton>
  );
};
