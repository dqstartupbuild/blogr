import type { LinkItem } from "../types/LinkItem";

type MergeProductLinkStatesOptions = {
  currentLinks: LinkItem[];
  refreshedLinks: LinkItem[];
};

export const mergeProductLinkStates = ({
  currentLinks,
  refreshedLinks,
}: MergeProductLinkStatesOptions) => {
  const currentByUrl = new Map(
    currentLinks.map((link) => [link.url.toLowerCase(), link]),
  );

  return refreshedLinks.map((link) => {
    const current = currentByUrl.get(link.url.toLowerCase());

    return {
      ...link,
      isActive: current?.isActive === false ? false : true,
    };
  });
};
