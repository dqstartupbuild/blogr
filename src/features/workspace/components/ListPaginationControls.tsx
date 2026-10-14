import { ChevronLeft, ChevronRight } from "lucide-react";
import { SecondaryButton } from "./SecondaryButton";
import type { ListPaginationState } from "../types/ListPaginationState";

type ListPaginationControlsProps = {
  pagination: ListPaginationState;
};

export const ListPaginationControls = ({
  pagination,
}: ListPaginationControlsProps) => {
  if (
    !pagination.canGoPrevious &&
    !pagination.canGoNext &&
    pagination.pageNumber === 1
  ) {
    return null;
  }

  return (
    <nav className="flex flex-wrap items-center justify-between gap-3">
      <span className="text-sm font-medium text-black">
        Page {pagination.pageNumber}
      </span>
      <div className="flex flex-wrap items-center gap-2">
        <SecondaryButton
          disabled={!pagination.canGoPrevious || pagination.isLoading}
          onClick={pagination.goToPreviousPage}
          type="button"
        >
          <ChevronLeft size={16} aria-hidden="true" />
          Previous
        </SecondaryButton>
        <SecondaryButton
          disabled={!pagination.canGoNext || pagination.isLoading}
          onClick={pagination.goToNextPage}
          type="button"
        >
          Next
          <ChevronRight size={16} aria-hidden="true" />
        </SecondaryButton>
      </div>
    </nav>
  );
};
