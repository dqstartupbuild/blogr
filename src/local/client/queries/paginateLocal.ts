export const paginateLocal = <T>(items: T[], args: Record<string, unknown>) => {
  const options = args.paginationOpts as { cursor?: string | null; numItems?: number } | undefined;
  const start = Math.max(0, Number(options?.cursor || 0) || 0);
  const size = Math.min(100, Math.max(1, options?.numItems || 20));
  return { page: items.slice(start, start + size), continueCursor: String(start + size), isDone: start + size >= items.length, pageStatus: null };
};
