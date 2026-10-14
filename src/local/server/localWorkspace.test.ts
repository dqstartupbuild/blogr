import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { readLocalState } from "./readLocalState";
import { updateLocalState } from "./updateLocalState";
import { mutateLocalState } from "./mutateLocalState";
import { buildLocalExport } from "./buildLocalExport";
import { importLocalExport } from "./importLocalExport";
import { getRuntimeMode } from "./getRuntimeMode";
import { withManagedMediaScope } from "./withManagedMediaScope";
import { trackManagedMedia } from "./trackManagedMedia";
import { writeLocalState } from "./writeLocalState";
import { open } from "node:fs/promises";

let directory = "";
const previousMode = process.env.BLOGR_MODE;
const previousHome = process.env.BLOGR_HOME;
beforeAll(async () => { directory = await mkdtemp(join(tmpdir(), "blogr-test-")); process.env.BLOGR_MODE = "test"; process.env.BLOGR_HOME = directory; });
afterAll(async () => { if (previousMode === undefined) delete process.env.BLOGR_MODE; else process.env.BLOGR_MODE = previousMode; if (previousHome === undefined) delete process.env.BLOGR_HOME; else process.env.BLOGR_HOME = previousHome; await rm(directory, { recursive: true, force: true }); });

describe("local workspace", () => {
  it("persists projects and topics, rejects stale writes, and isolates products", async () => {
    const first = await updateLocalState(0, (state) => mutateLocalState(state, "createProductWorkspaceMutation", { name: "Alpha" }));
    const firstId = first.result as string;
    const second = await updateLocalState(1, (state) => mutateLocalState(state, "createProductWorkspaceMutation", { name: "Beta" }));
    const secondId = second.result as string;
    await updateLocalState(2, (state) => mutateLocalState(state, "createTopicMutation", { productId: firstId, keyword: "First topic" }));
    expect((await readLocalState()).topics).toMatchObject([{ productId: firstId, keyword: "First topic" }]);
    expect((await readLocalState()).products.map((item) => item.id)).toEqual([firstId, secondId]);
    await expect(updateLocalState(2, (state) => mutateLocalState(state, "createTopicMutation", { productId: secondId, keyword: "Stale" }))).rejects.toThrow("changed");
    expect((await readLocalState()).topics).toHaveLength(1);
  });
  it("keeps prior data after failed validation and detects malformed storage", async () => {
    const before = await readFile(join(directory, "workspace.json"), "utf8");
    await expect(updateLocalState(3, (state) => { state.products[0].name = "Changed"; state.products[0].websiteUrl = 7 as unknown as string; })).rejects.toThrow();
    expect(await readFile(join(directory, "workspace.json"), "utf8")).toBe(before);
    await writeFile(join(directory, "workspace.json"), "{broken");
    await expect(readLocalState()).rejects.toThrow("Saved work could not be read");
    await writeFile(join(directory, "workspace.json"), before);
  });
  it("round trips backups and rejects import conflicts without changing data", async () => {
    const state = await readLocalState();
    const bytes = await buildLocalExport(state);
    await expect(importLocalExport(bytes, state.revision - 1)).rejects.toThrow("changed");
    expect((await readLocalState()).revision).toBe(state.revision);
    const imported = await importLocalExport(bytes, state.revision);
    expect(imported.state.products).toHaveLength(2);
    expect((await readLocalState()).revision).toBe(state.revision + 1);
  });
  it("fails closed on invalid runtime modes", () => {
    process.env.BLOGR_MODE = "hosted-production";
    expect(() => getRuntimeMode()).toThrow("Invalid BLOGR_MODE");
    process.env.BLOGR_MODE = "local-development";
    const previousNodeEnv = process.env.NODE_ENV;
    (process.env as Record<string, string | undefined>).NODE_ENV = "production";
    expect(() => getRuntimeMode()).toThrow("cannot run in a production build");
    delete process.env.BLOGR_MODE;
    expect(() => getRuntimeMode()).toThrow("Set BLOGR_MODE=local-production");
    (process.env as Record<string, string | undefined>).NODE_ENV = previousNodeEnv;
    process.env.BLOGR_MODE = "test";
  });
  it("serializes simultaneous changes and rejects a stale writer", async () => {
    const revision = (await readLocalState()).revision;
    const outcomes = await Promise.allSettled([
      updateLocalState(revision, (state) => mutateLocalState(state, "createTopicMutation", { productId: state.products[0].id, keyword: "Simultaneous A" })),
      updateLocalState(revision, (state) => mutateLocalState(state, "createTopicMutation", { productId: state.products[0].id, keyword: "Simultaneous B" })),
    ]);
    expect(outcomes.map((item) => item.status).sort()).toEqual(["fulfilled", "rejected"]);
    expect((await readLocalState()).topics.filter((item) => item.keyword.startsWith("Simultaneous"))).toHaveLength(1);
  });
  it("migrates schema zero and preserves the source when migration fails", async () => {
    const path = join(directory, "workspace.json");
    const original = await readFile(path, "utf8");
    const old = JSON.parse(original);
    old.schemaVersion = 0;
    delete old.blogVersions;
    await writeFile(path, JSON.stringify(old));
    expect((await readLocalState()).schemaVersion).toBe(1);
    expect(JSON.parse(await readFile(path, "utf8")).schemaVersion).toBe(0);
    old.products[0].id = "invalid";
    const malformed = JSON.stringify(old);
    await writeFile(path, malformed);
    await expect(readLocalState()).rejects.toThrow("Saved work could not be read");
    expect(await readFile(path, "utf8")).toBe(malformed);
    await writeFile(path, original);
  });
  it("backs up managed images, rejects an import conflict without replacing them, and excludes credentials", async () => {
    const png = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=", "base64");
    const name = `${randomUUID()}.png`;
    await mkdir(join(directory, "media"), { recursive: true });
    await writeFile(join(directory, "media", name), png);
    const before = await readLocalState();
    const saved = await updateLocalState(before.revision, (state) => {
      state.products[0].productImages.push(`/api/local/media/${name}`);
      (state.products[0] as object as Record<string, unknown>).accessToken = "must-not-export";
    });
    expect(JSON.stringify(saved.state)).not.toContain("must-not-export");
    const backup = await buildLocalExport(saved.state);
    expect(Buffer.from(backup).toString("latin1")).not.toContain("must-not-export");
    await expect(importLocalExport(backup, before.revision)).rejects.toThrow("changed");
    expect(await readFile(join(directory, "media", name))).toEqual(png);
    const restored = await importLocalExport(backup, saved.state.revision);
    const importedName = restored.state.products[0].productImages.at(-1)?.split("/").at(-1);
    expect(importedName).toBeTruthy();
    expect(importedName).not.toBe(name);
    expect(await readFile(join(directory, "media", importedName!))).toEqual(png);
    await expect(readFile(join(directory, "media", name))).rejects.toMatchObject({ code: "ENOENT" });
  });
  it("reports unavailable storage without changing saved work", async () => {
    const originalHome = process.env.BLOGR_HOME;
    const path = join(directory, "unavailable-file");
    await writeFile(path, "not a directory");
    process.env.BLOGR_HOME = path;
    try { await expect(readLocalState()).rejects.toThrow(); }
    finally { process.env.BLOGR_HOME = originalHome; }
    expect((await readLocalState()).products).toHaveLength(2);
  });
  it("removes images created by an operation that fails before commit", async () => {
    const name = `${randomUUID()}.png`;
    const path = join(directory, "media", name);
    await expect(withManagedMediaScope(async () => {
      await writeFile(path, "temporary image");
      trackManagedMedia(name);
      throw new Error("stale generation");
    })).rejects.toThrow("stale generation");
    await expect(readFile(path)).rejects.toMatchObject({ code: "ENOENT" });
  });
  it("keeps the prior workspace after a simulated storage-full write", async () => {
    const path = join(directory, "workspace.json");
    const original = await readFile(path, "utf8");
    const next = structuredClone(await readLocalState());
    next.products[0].name = "Must not commit";
    const fullDiskOpen: typeof open = async () => ({
      writeFile: async () => { throw Object.assign(new Error("Disk full"), { code: "ENOSPC" }); },
      close: async () => undefined,
    }) as unknown as Awaited<ReturnType<typeof open>>;
    await expect(writeLocalState(next, fullDiskOpen)).rejects.toMatchObject({ code: "ENOSPC" });
    expect(await readFile(path, "utf8")).toBe(original);
  });
});
