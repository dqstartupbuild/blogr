"use client";

import { useCallback, useState } from "react";

export const useCursorPagination = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageCursors, setPageCursors] = useState<(string | null)[]>([null]);
  const pageCursor = pageCursors[pageIndex] ?? null;
  const pageNumber = pageIndex + 1;
  const resetPagination = useCallback(() => {
    setPageIndex(0);
    setPageCursors([null]);
  }, []);
  const goToNextPage = useCallback(
    (cursor: string) => {
      setPageCursors((current) => {
        const nextCursors = current.slice(0, pageIndex + 1);

        nextCursors.push(cursor);

        return nextCursors;
      });
      setPageIndex((current) => current + 1);
    },
    [pageIndex],
  );
  const goToPreviousPage = useCallback(() => {
    setPageIndex((current) => Math.max(0, current - 1));
  }, []);

  return {
    canGoPrevious: pageIndex > 0,
    goToNextPage,
    goToPreviousPage,
    pageCursor,
    pageNumber,
    resetPagination,
  };
};
