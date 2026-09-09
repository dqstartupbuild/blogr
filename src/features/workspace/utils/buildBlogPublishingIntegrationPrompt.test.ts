import { describe, expect, it } from "vitest";

import { blogPublishingReceiverSkillUrl } from "../constants/publishing/blogPublishingReceiverSkillUrl";
import { buildBlogPublishingIntegrationPrompt } from "./buildBlogPublishingIntegrationPrompt";

describe("buildBlogPublishingIntegrationPrompt", () => {
  it("instructs the receiving agent to download and use the Blogr skill", () => {
    const prompt = buildBlogPublishingIntegrationPrompt("Example product");

    expect(prompt).toContain(blogPublishingReceiverSkillUrl);
    expect(prompt).toContain("download the complete Blogr publishing receiver skill folder");
    expect(prompt).toContain("read its SKILL.md entrypoint");
    expect(prompt).toContain("use $blogr-publishing-receiver for this task");
    expect(prompt).toContain("complete fallback brief");
    expect(prompt).toContain("compare the declared MIME type with the raster signature");
    expect(prompt).toContain("RIFF/WEBP signatures");
  });
});
