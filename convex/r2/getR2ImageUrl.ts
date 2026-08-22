import { r2 } from "./client";

export const getR2ImageUrl = async (key: string) => {
  return await r2.getUrl(key, {
    expiresIn: 60 * 60 * 24 * 7,
  });
};
