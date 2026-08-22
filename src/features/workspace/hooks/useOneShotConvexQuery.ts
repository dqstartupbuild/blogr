"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useConvex } from "convex/react";
import type {
  FunctionArgs,
  FunctionReference,
  FunctionReturnType,
} from "convex/server";

export const useOneShotConvexQuery = <
  Query extends FunctionReference<"query">,
>(
  queryReference: Query,
  args: FunctionArgs<Query> | "skip",
  refreshKey: number,
) => {
  const convex = useConvex();
  const [result, setResult] = useState<FunctionReturnType<Query>>();
  const [isLoading, setIsLoading] = useState(false);
  const argsKey = useMemo(
    () => (args === "skip" ? "skip" : JSON.stringify(args)),
    [args],
  );
  const argsRef = useRef(args);

  useEffect(() => {
    argsRef.current = args;
  }, [args, argsKey]);

  useEffect(() => {
    const currentArgs = argsRef.current;

    if (currentArgs === "skip") {
      setResult(undefined);
      setIsLoading(false);
      return;
    }

    let isActive = true;

    setIsLoading(true);
    void convex
      .query(queryReference, currentArgs)
      .then((data) => {
        if (isActive) {
          setResult(data);
        }
      })
      .catch(() => {
        if (isActive) {
          setResult(undefined);
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [argsKey, convex, queryReference, refreshKey]);

  return {
    isLoading,
    result,
  };
};
