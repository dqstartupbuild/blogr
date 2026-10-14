export const getBlogPublishTimestamp = (value?: number) => {
  return new Date(value || Date.now()).toISOString();
};
