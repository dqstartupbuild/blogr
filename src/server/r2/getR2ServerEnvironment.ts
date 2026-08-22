import type { R2ServerEnvironment } from "./types/R2ServerEnvironment";

export const getR2ServerEnvironment = (): R2ServerEnvironment | null => {
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const bucket = process.env.R2_BUCKET;
  const endpoint = process.env.R2_ENDPOINT;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

  if (!accessKeyId || !bucket || !endpoint || !secretAccessKey) {
    return null;
  }

  return {
    accessKeyId,
    bucket,
    endpoint,
    secretAccessKey,
  };
};
