import { z } from "zod";

export const calendarKeywordSuggestionsSchema = z.object({
  keywords: z.array(
    z.object({
      keyword: z.string().trim().min(1).max(120),
      readerNeed: z.string().trim().min(1).max(240),
      reason: z.string().trim().min(1).max(320),
    }),
  ),
});
