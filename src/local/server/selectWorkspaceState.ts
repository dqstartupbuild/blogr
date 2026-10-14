import type { LocalState } from "../domain/LocalState";

export const selectWorkspaceState = (
  state: LocalState,
  productId: string,
): LocalState => {
  const product = state.products.find((item) => item.id === productId);
  if (!product) throw new Error("This workspace no longer exists.");

  return {
    ...state,
    activeProductId: product.id,
    products: [product],
    topics: state.topics.filter((item) => item.productId === productId),
    blogs: state.blogs.filter((item) => item.productId === productId),
    blogVersions: state.blogVersions.filter((item) => item.productId === productId),
  };
};
