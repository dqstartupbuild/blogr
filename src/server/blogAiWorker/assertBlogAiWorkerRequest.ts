import { PublicError } from "../http/PublicError";
import { blogAiWorkerSecretHeader } from "./blogAiWorkerSecretHeader";
import { getBlogAiWorkerSecret } from "./getBlogAiWorkerSecret";

export const assertBlogAiWorkerRequest = (request: Request) => {
  const expectedSecret = getBlogAiWorkerSecret();
  const providedSecret = request.headers.get(blogAiWorkerSecretHeader)?.trim();

  if (!expectedSecret) {
    throw new PublicError("Add BLOG_AI_WORKER_SECRET before using the AI worker.", 500);
  }

  if (!providedSecret || providedSecret !== expectedSecret) {
    throw new PublicError("Worker request is not authorized.", 401);
  }
};
