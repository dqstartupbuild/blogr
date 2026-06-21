import { S3Client } from "@aws-sdk/client-s3";
import type { R2ServerEnvironment } from "./types/R2ServerEnvironment";

export const createR2ServerClient = (environment: R2ServerEnvironment) => {
  return new S3Client({
    credentials: {
      accessKeyId: environment.accessKeyId,
      secretAccessKey: environment.secretAccessKey,
    },
    endpoint: environment.endpoint,
    region: "auto",
  });
};
