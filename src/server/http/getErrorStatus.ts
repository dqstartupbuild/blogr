import { ZodError } from "zod";
import { AuthError } from "../auth/AuthError";

export const getErrorStatus = (error: unknown) => {
  if (error instanceof AuthError) return 401;
  if (error instanceof ZodError) return 400;
  return 500;
};
