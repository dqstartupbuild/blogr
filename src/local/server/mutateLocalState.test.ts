import { describe, expect, it } from "vitest";
import { emptyLocalState } from "../domain/emptyLocalState";
import { mutateLocalState } from "./mutateLocalState";
import { localStateSchema } from "../domain/localStateSchema";
import { randomUUID } from "node:crypto";
import { demoBlogs } from "@/features/workspace/constants/demoBlogs";

describe("local mutation routing", () => {
  it("saves article settings on the product and keeps credentials out of state", () => {
    const state = emptyLocalState();
    const productId = mutateLocalState(state, "createProductWorkspaceMutation", { name: "Books" }) as string;
    const settings = { ...state.products[0].blogGenerationSettings!, globalArticleInstructions: "Write plainly." };
    mutateLocalState(state, "updateBlogGenerationSettingsMutation", { productId, settings, expectedProductUpdatedAt: state.products[0].updatedAt });
    expect(state.products[0].blogGenerationSettings?.globalArticleInstructions).toBe("Write plainly.");
    expect(() => mutateLocalState(state, "updateBlogPublishingIntegrationMutation", { productId, enabled: true, accessToken: "secret", expectedProductUpdatedAt: state.products[0].updatedAt })).toThrow("server environment");
    expect(JSON.stringify(localStateSchema.parse(state))).not.toContain("secret");
  });
  it("deletes only the selected product and its records", () => {
    const state = emptyLocalState();
    const first = mutateLocalState(state, "createProductWorkspaceMutation", { name: "First" }) as string;
    const second = mutateLocalState(state, "createProductWorkspaceMutation", { name: "Second" }) as string;
    mutateLocalState(state, "createTopicMutation", { productId: first, keyword: "First topic" });
    mutateLocalState(state, "createTopicMutation", { productId: second, keyword: "Second topic" });
    mutateLocalState(state, "deleteProductWorkspaceMutation", { productId: first });
    expect(state.products.map((item) => item.id)).toEqual([second]);
    expect(state.topics.map((item) => item.keyword)).toEqual(["Second topic"]);
    expect(state.activeProductId).toBe(second);
  });
  it("rejects a stale article draft after another edit", () => {
    const state = emptyLocalState();
    const productId = mutateLocalState(state, "createProductWorkspaceMutation", { name: "Editor" }) as string;
    const blogId = randomUUID();
    state.blogs.push({ ...demoBlogs[0], id: blogId, productId, updatedAt: 1000 });
    mutateLocalState(state, "updateBlogContentMutation", { productId, blogId, expectedBlogUpdatedAt: 1000, title: "Other tab" });
    expect(() => mutateLocalState(state, "updateBlogContentMutation", { productId, blogId, expectedBlogUpdatedAt: 1000, title: "Stale draft" })).toThrow("changed on another tab");
    expect(state.blogs[0].title).toBe("Other tab");
  });
  it("schedules an existing saved topic when added from the calendar", () => {
    const state = emptyLocalState();
    const productId = mutateLocalState(state, "createProductWorkspaceMutation", { name: "Calendar" }) as string;
    const topicId = mutateLocalState(state, "createTopicMutation", { productId, keyword: "Existing" });
    expect(mutateLocalState(state, "createScheduledTopicMutation", { productId, keyword: "existing", scheduledDate: "2026-11-01" })).toBe(topicId);
    expect(state.topics).toHaveLength(1);
    expect(state.topics[0]).toMatchObject({ scheduledDate: "2026-11-01", status: "scheduled" });
    expect(() => mutateLocalState(state, "createScheduledTopicMutation", { productId, keyword: "existing", scheduledDate: "2026-11-02" })).toThrow("already scheduled");
  });
  it("keeps a stale product settings draft from replacing a newer save", () => {
    const state = emptyLocalState();
    const productId = mutateLocalState(state, "createProductWorkspaceMutation", { name: "Settings" }) as string;
    const initial = state.products[0].updatedAt;
    mutateLocalState(state, "updateProductDetailsMutation", { productId, expectedProductUpdatedAt: initial, name: "Other tab" });
    expect(() => mutateLocalState(state, "updateBlogGenerationSettingsMutation", { productId, expectedProductUpdatedAt: initial, settings: state.products[0].blogGenerationSettings })).toThrow("changed on another tab");
    expect(state.products[0].name).toBe("Other tab");
  });
  it("creates a blank article without an AI provider and links it to its topic", () => {
    const state = emptyLocalState();
    const productId = mutateLocalState(state, "createProductWorkspaceMutation", { name: "Offline" }) as string;
    const topicId = mutateLocalState(state, "createTopicMutation", { productId, keyword: "Offline writing" }) as string;
    const blogId = mutateLocalState(state, "upsertGeneratedBlogMutation", { productId, topicId, keyword: "Offline writing", title: "Offline writing", seoTitle: "Offline writing", slug: "offline-writing", excerpt: "", mdx: "", status: "draft", images: [], internalLinks: [], youtubeVideos: [], sources: [], tags: [] });
    expect(state.topics[0].blogId).toBe(blogId);
    expect(state.blogs[0].mdx).toBe("");
    expect(localStateSchema.parse(state).blogs).toHaveLength(1);
  });
});
