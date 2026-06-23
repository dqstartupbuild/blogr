export const createBlogPublishHeaders = (token: string) => {
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};
