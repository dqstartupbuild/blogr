export const extractJsonObject = (text: string) => {
  const startIndex = text.indexOf("{");
  const endIndex = text.lastIndexOf("}");

  if (startIndex === -1 || endIndex === -1 || endIndex <= startIndex) {
    throw new Error("The topic ideas response was not valid JSON.");
  }

  return text.slice(startIndex, endIndex + 1);
};
