import { ZodError } from "zod";
import { AuthError } from "../auth/AuthError";
import { PublicError } from "../http/PublicError";
import { getTopicBriefFailureMessage } from "./getTopicBriefFailureMessage";

export const normalizeTopicBriefRouteError = (error: unknown) => {
  if (
    error instanceof AuthError ||
    error instanceof PublicError ||
    error instanceof ZodError
  ) {
    return error;
  }

  return new PublicError(getTopicBriefFailureMessage(error), 502);
};
