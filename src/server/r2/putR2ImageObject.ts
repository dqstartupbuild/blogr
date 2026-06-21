import { PutObjectCommand } from "@aws-sdk/client-s3";
import { createR2ServerClient } from "./createR2ServerClient";
import type { R2ServerEnvironment } from "./types/R2ServerEnvironment";

type PutR2ImageObjectOptions = {
  body: ArrayBuffer;
  contentType: string;
  environment: R2ServerEnvironment;
  key: string;
};

export const putR2ImageObject = async ({
  body,
  contentType,
  environment,
  key,
}: PutR2ImageObjectOptions) => {
  await createR2ServerClient(environment).send(
    new PutObjectCommand({
      Body: Buffer.from(body),
      Bucket: environment.bucket,
      CacheControl: "public, max-age=31536000, immutable",
      ContentType: contentType,
      Key: key,
    }),
  );
};
