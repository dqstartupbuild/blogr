import Replicate from "replicate";

export const createReplicateClient = () => {
  const auth = process.env.REPLICATE_API_TOKEN;

  if (!auth) {
    throw new Error("Add REPLICATE_API_TOKEN first.");
  }

  return new Replicate({ auth });
};
