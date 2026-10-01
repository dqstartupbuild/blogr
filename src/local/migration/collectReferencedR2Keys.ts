import type { ConvexTables } from "./ConvexRecord";

export const collectReferencedR2Keys = (tables: ConvexTables, ownerId: string): Set<string> => {
  const keys = new Set<string>();
  for (const product of tables.products.filter((row) => row.userId === ownerId)) {
    for (const field of ["assetKeys", "productImageKeys"] as const) {
      for (const key of Array.isArray(product[field]) ? product[field] : []) if (typeof key === "string" && key) keys.add(key);
    }
  }
  for (const blog of [...tables.blogs, ...tables.blogVersions].filter((row) => row.userId === ownerId)) {
    for (const image of Array.isArray(blog.images) ? blog.images : []) {
      if (image && typeof image === "object" && typeof (image as Record<string, unknown>).r2Key === "string") keys.add((image as Record<string, string>).r2Key);
    }
  }
  const text = JSON.stringify({
    products: tables.products.filter((row) => row.userId === ownerId),
    blogs: tables.blogs.filter((row) => row.userId === ownerId),
    blogVersions: tables.blogVersions.filter((row) => row.userId === ownerId),
  });
  for (const match of text.matchAll(/https?:\/\/[^\s"'<>()[\]]+/g)) {
    try {
      const url = new URL(match[0]);
      if (url.hostname.endsWith(".r2.cloudflarestorage.com")) keys.add(decodeURIComponent(url.pathname.replace(/^\//, "")));
    } catch { /* Other text is not an image URL. */ }
  }
  return keys;
};
