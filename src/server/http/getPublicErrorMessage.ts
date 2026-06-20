import { ZodError } from "zod";
import { AuthError } from "../auth/AuthError";

export const getPublicErrorMessage = (error: unknown) => {
  if (error instanceof AuthError) return error.message;
  if (error instanceof ZodError) return error.issues[0]?.message || "Check the form.";
  if (error instanceof Error && error.message) return error.message;
  return "Something went wrong.";
};
