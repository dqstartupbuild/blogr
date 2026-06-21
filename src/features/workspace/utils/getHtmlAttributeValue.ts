export const getHtmlAttributeValue = (html: string, name: string) => {
  const pattern = new RegExp(`${name}\\s*=\\s*["']([^"']+)["']`, "i");
  const [, value] = html.match(pattern) || [];

  return value || "";
};
