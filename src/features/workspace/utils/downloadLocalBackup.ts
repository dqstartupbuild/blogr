export const downloadLocalBackup = async (productId?: string) => {
  const query = productId ? `?productId=${encodeURIComponent(productId)}` : "";
  const response = await fetch(`/api/local/export${query}`, { cache: "no-store" });
  if (!response.ok) throw new Error("Could not back up your work.");

  const filename =
    response.headers
      .get("Content-Disposition")
      ?.match(/filename="([^"]+)"/)?.[1] || "blogr-backup.zip";
  const url = URL.createObjectURL(await response.blob());
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
};
