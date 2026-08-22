import { ZodError } from "zod";
import { AuthError } from "../auth/AuthError";
import { PublicError } from "./PublicError";

export const logRouteError = (error: unknown) => {
  if (
    error instanceof AuthError ||
    error instanceof PublicError ||
    error instanceof ZodError
  ) {
    return;
  }

  console.error("[api-route]", error);
};
