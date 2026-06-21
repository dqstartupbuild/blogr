import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createR2ServerClient } from "./createR2ServerClient";
import type { R2ServerEnvironment } from "./types/R2ServerEnvironment";

type GetR2SignedImageUrlOptions = {
  environment: R2ServerEnvironment;
  key: string;
};

export const getR2SignedImageUrl = async ({
  environment,
  key,
}: GetR2SignedImageUrlOptions) => {
  return await getSignedUrl(
    createR2ServerClient(environment),
    new GetObjectCommand({
      Bucket: environment.bucket,
      Key: key,
    }),
    { expiresIn: 60 * 60 * 24 * 7 },
  );
};
