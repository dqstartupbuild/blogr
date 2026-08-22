export const normalizeTopicExpansionPhrase = (value: string) => {
  const cleanValue = value
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/[()[\]{}]/g, " ")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, "");

  return cleanValue.split(/\s+/).slice(0, 8).join(" ");
};
