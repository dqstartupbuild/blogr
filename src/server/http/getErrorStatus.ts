import { ZodError } from "zod";
import { AuthError } from "../auth/AuthError";
import { PublicError } from "./PublicError";

export const getErrorStatus = (error: unknown) => {
  if (error instanceof AuthError) return 401;
  if (error instanceof PublicError) return error.status;
  if (error instanceof ZodError) return 400;
  return 500;
};
