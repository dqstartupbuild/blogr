export type ListPaginationState = {
  canGoNext: boolean;
  canGoPrevious: boolean;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  isLoading: boolean;
  pageNumber: number;
};
