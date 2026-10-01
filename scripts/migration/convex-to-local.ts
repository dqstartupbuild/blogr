import { runConvexMigration } from "../../src/local/migration/runConvexMigration";

const flags = Object.fromEntries(process.argv.slice(2).reduce<string[][]>((pairs, value, index, values) => {
  if (index % 2 === 0) pairs.push([value.replace(/^--/, ""), values[index + 1] || ""]);
  return pairs;
}, []));
const { input, "media-manifest": mediaManifest, output, "owner-id": ownerId } = flags;
if (!input || !mediaManifest || !output || !ownerId || process.argv.slice(2).length !== 8) {
  throw new Error("Usage: npm run migrate:convex -- --input <export.zip|directory> --media-manifest <manifest.json> --output <new directory outside repo> --owner-id <verified Clerk ID>");
}
runConvexMigration({ input, mediaManifest, output, ownerId })
  .then((report) => process.stdout.write(`${JSON.stringify(report, null, 2)}\n`))
  .catch((error: unknown) => { process.stderr.write(`${error instanceof Error ? error.message : "Migration failed."}\n`); process.exitCode = 1; });
