import type { R2ImageCategory } from "./types/R2ImageCategory";
import { sanitizeR2KeyPart } from "./sanitizeR2KeyPart";

type BuildR2ImageKeyOptions = {
  category: R2ImageCategory;
  extension: string;
  filenameHint?: string;
  userId: string;
};

export const buildR2ImageKey = ({
  category,
  extension,
  filenameHint,
  userId,
}: BuildR2ImageKeyOptions) => {
  const safeUserId = sanitizeR2KeyPart(userId) || "user";
  const safeCategory = sanitizeR2KeyPart(category) || "images";
  const safeFilename = filenameHint ? sanitizeR2KeyPart(filenameHint) : "";
  const baseName = safeFilename || crypto.randomUUID();

  return `${safeUserId}/${safeCategory}/${baseName}-${crypto.randomUUID()}.${extension}`;
};
