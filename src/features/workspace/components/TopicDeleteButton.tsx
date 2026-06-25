"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { SecondaryButton } from "./SecondaryButton";

type TopicDeleteButtonProps = {
  onDelete: () => Promise<void> | void;
};

export const TopicDeleteButton = ({ onDelete }: TopicDeleteButtonProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm("Delete this topic?")) {
      return;
    }

    setIsDeleting(true);

    try {
      await onDelete();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <SecondaryButton disabled={isDeleting} onClick={handleDelete} type="button">
      <Trash2 size={16} aria-hidden="true" />
      {isDeleting ? "Deleting" : "Delete"}
    </SecondaryButton>
  );
};
