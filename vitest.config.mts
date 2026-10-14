import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";
export default defineConfig({ resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } }, test: { isolate: true, include: ["src/local/**/*.test.ts", "src/features/workspace/utils/buildCalendarQueueDateKeys.test.ts", "src/features/workspace/utils/buildQuickFillAssignments.test.ts", "src/features/workspace/utils/buildBlogPublishingIntegrationPrompt.test.ts", "src/server/replicate/*.test.ts", "src/server/blog/tryGenerateBlogImage.test.ts"] } });
