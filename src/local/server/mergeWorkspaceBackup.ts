import type { LocalState } from "../domain/LocalState";

// Adds a single-workspace backup, replacing that workspace if it already exists.
// Other workspaces are left untouched.
export const mergeWorkspaceBackup = (state: LocalState, backup: LocalState) => {
  const [product] = backup.products;
  if (!product || backup.products.length !== 1) throw new Error("This workspace backup should contain exactly one workspace.");

  const isOtherWorkspace = (item: { productId?: string }) => item.productId !== product.id;
  const topics = state.topics.filter(isOtherWorkspace);
  const blogs = state.blogs.filter(isOtherWorkspace);
  const blogVersions = state.blogVersions.filter(isOtherWorkspace);
  const takenIds = new Set([...topics, ...blogs].map((item) => item.id));
  if ([...backup.topics, ...backup.blogs].some((item) => takenIds.has(item.id))) {
    throw new Error("This backup overlaps with another workspace on this computer, so it can't be restored here.");
  }

  const existingIndex = state.products.findIndex((item) => item.id === product.id);
  state.products = existingIndex === -1
    ? [...state.products, product]
    : state.products.map((item, index) => (index === existingIndex ? product : item));
  state.topics = [...topics, ...backup.topics];
  state.blogs = [...blogs, ...backup.blogs];
  state.blogVersions = [...blogVersions, ...backup.blogVersions];
  state.activeProductId = product.id;

  return { productName: product.name, replacedExisting: existingIndex !== -1 };
};
