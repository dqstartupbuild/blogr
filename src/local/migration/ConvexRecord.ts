export type ConvexRecord = Record<string, unknown> & { _id: string; userId: string };

export type ConvexTables = {
  products: ConvexRecord[];
  topics: ConvexRecord[];
  blogs: ConvexRecord[];
  blogVersions: ConvexRecord[];
  aiJobs: ConvexRecord[];
  workspaceSelections: ConvexRecord[];
};
