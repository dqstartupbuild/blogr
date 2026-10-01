import type { LocalState } from "./LocalState";

export const emptyLocalState = (): LocalState => ({
  schemaVersion: 1,
  revision: 0,
  activeProductId: null,
  products: [],
  topics: [],
  blogs: [],
  blogVersions: [],
});
