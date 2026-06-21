import { Children, isValidElement, type ReactNode } from "react";

export const getReactNodeText = (node: ReactNode): string => {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(getReactNodeText).join("");
  }

  if (isValidElement<{ children?: ReactNode }>(node)) {
    return getReactNodeText(node.props.children);
  }

  const children = Children.toArray(node);

  return children.map(getReactNodeText).join("");
};
