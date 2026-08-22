export const isBlogPublishSetupMessage = (message: string) => {
  return message.toLowerCase().includes("publishing integration");
};
