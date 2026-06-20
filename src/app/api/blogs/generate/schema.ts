import { z } from "zod";

export const blogGenerateRequestSchema = z.object({
  topicId: z.string().min(1, "Choose a topic first."),
});
