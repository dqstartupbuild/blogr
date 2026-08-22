export const getWorkspaceSwitchRoute = (pathname: string | null) => {
  if (pathname?.startsWith("/blogs/")) {
    return "/blogs";
  }

  return null;
};
