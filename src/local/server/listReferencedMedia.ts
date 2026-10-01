import type { LocalState } from "../domain/LocalState";
export const listReferencedMedia = (state: LocalState): string[] => {
  const names = new Set<string>();
  const text = JSON.stringify(state);
  for (const match of text.matchAll(/\/api\/local\/media\/([a-f0-9-]{36}\.(?:png|jpg|webp|gif))/g)) names.add(match[1]);
  return [...names];
};
