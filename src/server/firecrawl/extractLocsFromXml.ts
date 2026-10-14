import { decodeXmlEntities } from "./decodeXmlEntities";

export const extractLocsFromXml = (xml: string) => {
  const matches = xml.matchAll(/<loc>([\s\S]*?)<\/loc>/gi);
  const locs: string[] = [];

  for (const match of matches) {
    const raw = match[1]?.trim();
    if (raw) locs.push(decodeXmlEntities(raw));
  }

  return locs;
};
