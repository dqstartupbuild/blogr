import { describe, expect, it } from "vitest";

import { blogPublishingReceiverSkillUrl } from "../constants/publishing/blogPublishingReceiverSkillUrl";
import { buildBlogPublishingIntegrationPrompt } from "./buildBlogPublishingIntegrationPrompt";

describe("buildBlogPublishingIntegrationPrompt", () => {
  it("instructs the receiving agent to download and use the Blogr skill", () => {
    const prompt = buildBlogPublishingIntegrationPrompt("Example product");

    expect(prompt).toContain(blogPublishingReceiverSkillUrl);
    expect(prompt).toContain("download the complete Blogr publishing receiver skill folder");
    expect(prompt).toContain("Read its SKILL.md entrypoint first");
    expect(prompt).toContain("continue with the complete brief below");
    expect(prompt).toContain("/skills/blogr-publishing-receiver");
    expect(prompt).not.toMatch(/\$blogr|codex/i);
    expect(prompt).toContain("compare the declared MIME type with the raster signature");
    expect(prompt).toContain("RIFF/WEBP signatures");
  });
});
