export type RuntimeMode = "local-development" | "local-production" | "test";

export const getRuntimeMode = (): RuntimeMode => {
  if (!process.env.BLOGR_MODE && process.env.NODE_ENV === "production") throw new Error("Set BLOGR_MODE=local-production before starting a production build or server.");
  const value = process.env.BLOGR_MODE || (process.env.NODE_ENV === "test" ? "test" : "local-development");
  if (value !== "local-development" && value !== "local-production" && value !== "test") {
    throw new Error(`Invalid BLOGR_MODE: ${value}`);
  }
  if (process.env.NODE_ENV === "production" && value === "local-development") throw new Error("Development workspace mode cannot run in a production build.");
  return value;
};
