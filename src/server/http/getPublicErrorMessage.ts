import { ZodError } from "zod";
import { AuthError } from "../auth/AuthError";
import { PublicError } from "./PublicError";

const fallbackPublicErrorMessage = "Something went wrong. Please try again.";

export const getPublicErrorMessage = (error: unknown) => {
  if (error instanceof AuthError) return error.message;
  if (error instanceof PublicError) return error.message;
  if (error instanceof ZodError) return error.issues[0]?.message || "Check the form.";
  return fallbackPublicErrorMessage;
};
