export const assertAiWorkerSecret = (secret: string) => {
  const expectedSecret = process.env.BLOG_AI_WORKER_SECRET?.trim();

  if (!expectedSecret || secret !== expectedSecret) {
    throw new Error("Worker request is not authorized.");
  }
};
