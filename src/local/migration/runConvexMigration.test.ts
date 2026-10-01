import { afterEach, describe, expect, it } from "vitest";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import JSZip from "jszip";
import { runConvexMigration } from "./runConvexMigration";
import { stableLocalId } from "./stableLocalId";
import { getBlogPublishToken } from "@/server/publishing/getBlogPublishToken";

const owner = "user_verified_test";
const oldUrl = "https://bucket.example.r2.cloudflarestorage.com/user/image.png?X-Amz-Signature=private";
const image = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=", "base64");
const created: string[] = [];

const fixture = async () => {
  const directory = await mkdtemp(join(tmpdir(), "blogr-migration-"));
  created.push(directory);
  const input = join(directory, "export");
  await mkdir(input);
  const product = { _id: "product_old", userId: owner, name: "Original", websiteUrl: "", description: "", niche: "", audience: "", competitors: "", colors: ["#123456"], assets: [oldUrl], assetKeys: ["user/image.png"], productImages: [], siteLinks: [], rawContext: "", scannedAt: 123, createdAt: 100, updatedAt: 200, blogPublishingIntegration: { enabled: true, hasAccessToken: true, accessToken: "must-not-export", sourceName: "Original", webhookUrl: "https://example.test/publish" } };
  const topic = { _id: "topic_old", userId: owner, productId: product._id, blogId: "blog_old", keyword: "Keyword", status: "written", createdAt: 110, updatedAt: 210 };
  const blog = { _id: "blog_old", userId: owner, productId: product._id, topicId: topic._id, keyword: "Keyword", title: "Title", slug: "title", excerpt: "Excerpt", status: "draft", mdx: `![Image](${oldUrl})`, featureImageUrl: oldUrl, images: [{ alt: "Image", prompt: "Prompt", url: oldUrl, r2Key: "user/image.png" }], internalLinks: [], youtubeVideos: [], sources: [], createdAt: 120, updatedAt: 220 };
  const version = { ...blog, _id: "version_old", blogId: blog._id, blogCreatedAt: 120, blogUpdatedAt: 190, archivedAt: 230, versionNumber: 1 };
  const job = { _id: "job_old", userId: owner, productId: product._id, type: "blog.generate", status: "succeeded", attempts: 1, createdAt: 130, updatedAt: 240, input: { apiKey: "private-key", prompt: `Write for ${owner}`, userId: owner }, result: { image: oldUrl } };
  for (const [name, rows] of Object.entries({ products: [product], topics: [topic], blogs: [blog], blogVersions: [version], aiJobs: [job], workspaceSelections: [{ _id: "selection_old", userId: owner, productId: product._id, updatedAt: 250 }] })) await writeFile(join(input, `${name}.jsonl`), rows.map((row) => JSON.stringify(row)).join("\n"));
  await writeFile(join(directory, "image.png"), image);
  await writeFile(join(directory, "unused.png"), image);
  await writeFile(join(directory, "foreign.png"), image);
  const mediaManifest = join(directory, "manifest.json");
  await writeFile(mediaManifest, JSON.stringify([{ r2Key: "user/image.png", sourceUrl: oldUrl, file: "image.png" }, { r2Key: `${owner}/unused.png`, file: "unused.png" }, { r2Key: "user_foreign/secret.png", file: "foreign.png" }]));
  return { directory, input, mediaManifest, product, blog };
};

afterEach(async () => { delete process.env.BLOG_PUBLISH_WEBHOOK_TOKENS; delete process.env.BLOG_PUBLISH_WEBHOOK_TOKEN; await Promise.all(created.splice(0).map((path) => rm(path, { recursive: true, force: true }))); });

describe("Convex to local migration", () => {
  it("preserves records, relations, timestamps, image bytes, and sanitized job history", async () => {
    const source = await fixture();
    const output = join(source.directory, "staged-home");
    const report = await runConvexMigration({ input: source.input, mediaManifest: source.mediaManifest, output, ownerId: owner });
    expect(report.counts).toEqual({ products: 1, topics: 1, blogs: 1, blogVersions: 1, aiJobsArchived: 1, media: 1, unreferencedMediaArchived: 1 });
    expect(report.foreignUnreferencedMediaSkipped).toBe(1);
    const workspaceText = await readFile(join(output, "workspace.json"), "utf8");
    const state = JSON.parse(workspaceText);
    expect(state.products[0].id).toBe(stableLocalId("products", source.product._id));
    expect(state.products[0].scannedAt).toBe(123);
    expect(state.topics[0].blogId).toBe(state.blogs[0].id);
    expect(state.blogs[0].topicId).toBe(state.topics[0].id);
    expect(state.blogVersions[0].blogId).toBe(state.blogs[0].id);
    expect(state.blogVersions[0].updatedAt).toBe(190);
    expect(state.blogs[0].mdx).toContain("/api/local/media/");
    expect(workspaceText).not.toContain("must-not-export");
    expect(workspaceText).not.toContain("X-Amz-Signature");
    const name = state.blogs[0].featureImageUrl.split("/").at(-1);
    expect(await readFile(join(output, "media", name))).toEqual(image);
    const historicalMedia = JSON.parse(await readFile(join(output, "archive", "unreferenced-media-manifest.json"), "utf8"));
    expect(historicalMedia).toHaveLength(1);
    expect(historicalMedia[0].sourceKeySuffix).toBe("unused.png");
    expect(JSON.stringify(historicalMedia)).not.toContain(owner);
    expect(await readFile(join(output, "archive", historicalMedia[0].file))).toEqual(image);
    const archive = await readFile(join(output, "archive", "ai-jobs.json"), "utf8");
    expect(archive).toContain("[redacted]");
    expect(archive).not.toContain("private-key");
    expect(archive).not.toContain(owner);
    expect(archive).not.toContain("X-Amz-Signature");
  });

  it("reads the original Convex ZIP layout and refuses wrong ownership or existing output", async () => {
    const source = await fixture();
    const zip = new JSZip();
    for (const name of ["products", "topics", "blogs", "blogVersions", "aiJobs", "workspaceSelections"]) zip.file(`${name}/documents.jsonl`, await readFile(join(source.input, `${name}.jsonl`)));
    const input = join(source.directory, "snapshot.zip");
    await writeFile(input, await zip.generateAsync({ type: "nodebuffer" }));
    const output = join(source.directory, "staged-home");
    await expect(runConvexMigration({ input, mediaManifest: source.mediaManifest, output, ownerId: "user_wrong" })).rejects.toThrow("No products");
    await runConvexMigration({ input, mediaManifest: source.mediaManifest, output, ownerId: owner });
    await expect(runConvexMigration({ input, mediaManifest: source.mediaManifest, output, ownerId: owner })).rejects.toThrow();
  });

  it("keeps per-product publishing tokens in environment only", async () => {
    const first = stableLocalId("products", "first");
    const second = stableLocalId("products", "second");
    process.env.BLOG_PUBLISH_WEBHOOK_TOKENS = JSON.stringify({ [first]: "first-secret", [second]: "second-secret" });
    process.env.BLOG_PUBLISH_WEBHOOK_TOKEN = "fallback-secret";
    expect(getBlogPublishToken(first)).toBe("first-secret");
    expect(getBlogPublishToken(second)).toBe("second-secret");
    expect(getBlogPublishToken(stableLocalId("products", "other"))).toBe("fallback-secret");
  });
});
