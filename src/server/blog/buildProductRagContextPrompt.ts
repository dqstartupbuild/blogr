export const buildProductRagContextPrompt = (productRagContext: string) => {
  if (!productRagContext.trim()) {
    return "Retrieved product context: none.";
  }

  return `
Retrieved product context from the scanned website:
${productRagContext.trim()}

Use this context for product accuracy, reader fit, examples, and natural internal link placement. Do not quote it as a separate research source unless it is useful to the reader.
`.trim();
};
