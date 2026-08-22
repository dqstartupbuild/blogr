"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

type DeleteActionButtonProps = {
  confirmMessage: string;
  label: string;
  onDelete: () => Promise<void> | void;
};

export const DeleteActionButton = ({
  confirmMessage,
  label,
  onDelete,
}: DeleteActionButtonProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm(confirmMessage)) {
      return;
    }

    setIsDeleting(true);

    try {
      await onDelete();
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Could not delete yet.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      className="inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-md border border-black/15 bg-white px-4 text-sm font-semibold text-black shadow-sm transition hover:border-black hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
      disabled={isDeleting}
      onClick={handleDelete}
      type="button"
    >
      <Trash2 size={16} aria-hidden="true" />
      {isDeleting ? "Deleting" : label}
    </button>
  );
};
