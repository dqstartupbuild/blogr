import { getConvexAuthToken } from "./getConvexAuthToken";

export const getOptionalConvexAuthToken = async () => {
  try {
    return await getConvexAuthToken();
  } catch {
    return undefined;
  }
};
