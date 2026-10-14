import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import JSZip from "jszip";
import { buildLocalExport } from "./buildLocalExport";
import { importLocalExport } from "./importLocalExport";
import { mutateLocalState } from "./mutateLocalState";
import { readLocalState } from "./readLocalState";
import { selectWorkspaceState } from "./selectWorkspaceState";
import { updateLocalState } from "./updateLocalState";

let directory = "";
const previousMode = process.env.BLOGR_MODE;
const previousHome = process.env.BLOGR_HOME;
beforeAll(async () => { directory = await mkdtemp(join(tmpdir(), "blogr-backup-test-")); process.env.BLOGR_MODE = "test"; process.env.BLOGR_HOME = directory; });
afterAll(async () => { if (previousMode === undefined) delete process.env.BLOGR_MODE; else process.env.BLOGR_MODE = previousMode; if (previousHome === undefined) delete process.env.BLOGR_HOME; else process.env.BLOGR_HOME = previousHome; await rm(directory, { recursive: true, force: true }); });

const change = async (mutation: string, args: Record<string, unknown>) => {
  const { revision } = await readLocalState();
  return (await updateLocalState(revision, (state) => mutateLocalState(state, mutation as never, args as never))).result;
};

describe("workspace backup", () => {
  it("backs up one workspace and restores it without touching the others", async () => {
    const alphaId = await change("createProductWorkspaceMutation", { name: "Alpha" }) as string;
    const betaId = await change("createProductWorkspaceMutation", { name: "Beta" }) as string;
    await change("createTopicMutation", { productId: alphaId, keyword: "Alpha topic" });
    await change("createTopicMutation", { productId: betaId, keyword: "Beta topic" });

    const backup = await buildLocalExport(selectWorkspaceState(await readLocalState(), alphaId), "workspace");
    const manifest = JSON.parse(await new JSZip().loadAsync(backup).then((zip) => zip.file("workspace.json")!.async("string")));
    expect(manifest.scope).toBe("workspace");
    expect(manifest.workspace.products.map((item: { name: string }) => item.name)).toEqual(["Alpha"]);
    expect(manifest.workspace.topics.map((item: { keyword: string }) => item.keyword)).toEqual(["Alpha topic"]);

    await change("deleteProductWorkspaceMutation", { productId: alphaId });
    await change("createTopicMutation", { productId: betaId, keyword: "Second beta topic" });

    const restored = await importLocalExport(backup, (await readLocalState()).revision);
    expect(restored.result).toMatchObject({ scope: "workspace", productName: "Alpha", replacedExisting: false });
    let state = await readLocalState();
    expect(state.products.map((item) => item.name).sort()).toEqual(["Alpha", "Beta"]);
    expect(state.topics.filter((item) => item.productId === betaId)).toHaveLength(2);
    expect(state.activeProductId).toBe(alphaId);

    await change("createTopicMutation", { productId: alphaId, keyword: "Added after backup" });
    const replaced = await importLocalExport(backup, (await readLocalState()).revision);
    expect(replaced.result).toMatchObject({ replacedExisting: true });
    state = await readLocalState();
    expect(state.products).toHaveLength(2);
    expect(state.topics.filter((item) => item.productId === alphaId).map((item) => item.keyword)).toEqual(["Alpha topic"]);
    expect(state.topics.filter((item) => item.productId === betaId)).toHaveLength(2);
  });

  it("still treats older backups without a scope as full account backups", async () => {
    const before = await readLocalState();
    const accountBackup = await buildLocalExport(selectWorkspaceState(before, before.products[0].id));
    const zip = await new JSZip().loadAsync(accountBackup);
    const manifest = JSON.parse(await zip.file("workspace.json")!.async("string"));
    delete manifest.scope;
    zip.file("workspace.json", JSON.stringify(manifest));
    const legacy = await zip.generateAsync({ type: "arraybuffer" });

    const imported = await importLocalExport(legacy, before.revision);
    expect(imported.result).toMatchObject({ scope: "account", importedProducts: 1 });
    expect((await readLocalState()).products).toHaveLength(1);
  });
});
