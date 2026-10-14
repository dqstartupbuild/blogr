"use client";

import { useMemo, useState } from "react";
import { useQuery } from "./useQuery";

export const usePaginatedQuery = (name: "listBlogVersionsQuery", args: Record<string, unknown>, options: { initialNumItems: number }) => {
  const [size, setSize] = useState(options.initialNumItems);
  const result = useQuery<{ id: string }[]>(name, args);
  return useMemo(() => ({ results: result?.slice(0, size), status: result === undefined ? "LoadingFirstPage" : result.length > size ? "CanLoadMore" : "Exhausted", loadMore: (count: number) => setSize((current) => current + count) }), [result, size]);
};
