export const extractTaggedValue = (text: string, tagName: string) => {
  const pattern = new RegExp(`<${tagName}>\\s*([\\s\\S]*?)\\s*<\\/${tagName}>`, "i");
  const value = text.match(pattern)?.[1]?.trim();

  return value?.replace(/^<!\[CDATA\[/, "").replace(/\]\]>$/, "").trim();
};
