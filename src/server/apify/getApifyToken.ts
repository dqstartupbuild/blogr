export const getApifyToken = () => {
  const token = process.env.APIFY_TOKEN?.trim();

  if (!token) {
    throw new Error("Add APIFY_TOKEN first.");
  }

  return token;
};
