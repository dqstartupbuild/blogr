export const downloadBlob = ({
  blob,
  filename,
}: {
  blob: Blob;
  filename: string;
}) => {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
};
