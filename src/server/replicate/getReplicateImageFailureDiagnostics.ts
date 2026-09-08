export const getReplicateImageFailureDiagnostics = ({
  error,
  stage,
}: {
  error?: unknown;
  stage: "missing-output" | "prediction";
}) => {
  const candidate =
    error && typeof error === "object"
      ? (error as {
          cause?: { code?: unknown };
          name?: unknown;
          response?: { status?: unknown };
        })
      : undefined;
  const httpStatus = candidate?.response?.status;
  const networkCode = candidate?.cause?.code;

  return {
    errorName:
      typeof candidate?.name === "string" ? candidate.name : "UnknownError",
    ...(typeof httpStatus === "number" ? { httpStatus } : {}),
    model: process.env.REPLICATE_IMAGE_MODEL || "google/nano-banana-2",
    ...(typeof networkCode === "string" ? { networkCode } : {}),
    stage,
  };
};
