export const normalizeReplicateTextOutput = (output: unknown) => {
  if (typeof output === "string") return output;
  if (Array.isArray(output)) return output.join("");

  if (output && typeof output === "object" && "text" in output) {
    const text = (output as { text?: unknown }).text;
    if (typeof text === "string") return text;
  }

  return JSON.stringify(output);
};
